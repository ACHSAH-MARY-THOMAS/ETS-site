from django.contrib.auth import authenticate, login, logout
from django.utils import timezone
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Team, Level, Progress
from .serializers import TeamSerializer, LevelSerializer


@api_view(['GET'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def get_csrf_token(request):
    """Get CSRF token for authentication"""
    return Response({'detail': 'CSRF cookie set'})


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Team login endpoint"""
    team_id = request.data.get('team_id')
    password = request.data.get('password')
    
    if not team_id or not password:
        return Response(
            {'error': 'Team ID and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Authenticate team
    user = authenticate(request, username=team_id, password=password)
    
    if user is not None:
        # Check if team already has an active session
        # ALLOW MULTI-LOGIN for all users as requested
        # if user.is_active_session and user.team_id != 'common':
        #     return Response(
        #         {'error': 'This team is already logged in from another device'},
        #         status=status.HTTP_403_FORBIDDEN
        #     )
        
        # Login the team
        login(request, user)
        
        # Mark session as active
        user.is_active_session = True
        if not user.started_at:
            user.started_at = timezone.now()
        user.save()
        
        return Response({
            'success': True,
            'message': 'Login successful',
            'team': TeamSerializer(user).data
        })
    else:
        return Response(
            {'error': 'Invalid team ID or password'},
            status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """Team logout endpoint"""
    user = request.user
    user.is_active_session = False
    user.save()
    logout(request)
    
    return Response({'success': True, 'message': 'Logout successful'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_level(request):
    """Get current level for the authenticated team"""
    team = request.user
    
    try:
        level = Level.objects.get(level_number=team.current_level)
        
        # Create or get progress record
        progress, created = Progress.objects.get_or_create(
            team=team,
            level=level
        )
        
        return Response({
            'level': LevelSerializer(level).data,
            'current_level_number': team.current_level,
            'total_time_seconds': team.total_time_seconds,
            'attempts': progress.attempts
        })
    except Level.DoesNotExist:
        return Response(
            {'error': 'Level not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_answer(request):
    """Submit answer for current level"""
    team = request.user
    submitted_answer = request.data.get('answer', '').strip().lower()
    
    if not submitted_answer:
        return Response(
            {'error': 'Answer is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        level = Level.objects.get(level_number=team.current_level)
        progress = Progress.objects.get(team=team, level=level)
        
        # Increment attempts
        progress.attempts += 1
        progress.save()
        
        # Check answer (case-insensitive)
        if submitted_answer == level.answer.strip().lower():
            # Correct answer
            progress.completed_at = timezone.now()
            progress.time_taken_seconds = int((progress.completed_at - progress.started_at).total_seconds())
            progress.save()
            
            # Update team progress
            team.current_level += 1
            team.total_time_seconds += progress.time_taken_seconds
            
            # Check if all levels completed
            total_levels = Level.objects.count()
            if team.current_level > total_levels:
                team.completed_at = timezone.now()
            
            team.save()
            
            return Response({
                'correct': True,
                'message': 'Correct! Level unlocked.',
                'next_level': team.current_level,
                'is_completed': team.current_level > total_levels
            })
        else:
            # Wrong answer
            return Response({
                'correct': False,
                'message': 'Incorrect answer. Try again.',
                'attempts': progress.attempts
            })
            
    except Level.DoesNotExist:
        return Response(
            {'error': 'Level not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Progress.DoesNotExist:
        return Response(
            {'error': 'Progress record not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def team_status(request):
    """Get current team status"""
    team = request.user
    return Response({
        'team_id': team.team_id,
        'current_level': team.current_level,
        'total_time_seconds': team.total_time_seconds,
        'started_at': team.started_at,
        'completed_at': team.completed_at
    })