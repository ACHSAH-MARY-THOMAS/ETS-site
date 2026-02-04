import { Terminal as TerminalIcon } from "lucide-react";
import { AnswerInput } from "@/components/AnswerInput";

interface VideoPuzzleProps {
    onSolve: (answer: string) => Promise<boolean>;
    level?: number;
    answer: string;
}

export const VideoPuzzle = ({ onSolve, level = 4, answer }: VideoPuzzleProps) => {
    return (
        <div className="w-full h-full flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-secondary/60 to-secondary/40 px-5 py-3.5 border-b-2 border-primary/30 flex items-center gap-3 flex-shrink-0 shadow-lg rounded-t">
                <TerminalIcon className="h-5 w-5 text-primary animate-pulse" />
                <span className="text-sm uppercase tracking-[0.25em] text-primary font-bold">
                    Security Layer {level.toString().padStart(2, '0')}
                </span>
            </div>

            {/* Subheader */}
            <div className="bg-secondary/20 px-5 py-2 border-b border-primary/20 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <span className="text-primary text-lg">&gt;</span>
                    <span className="text-xs uppercase tracking-[0.2em] text-primary/90 font-semibold">
                        PERCEPTION DISCIPLINE TEST
                    </span>
                </div>
            </div>
            
            <div className="flex-1 flex flex-col px-4 py-2 min-h-0">
                {/* Question */}
                <div className="w-full flex-shrink-0 mb-1">
                    <div className="text-left space-y-1">
                        <p className="text-xs md:text-sm font-medium tracking-wide text-foreground leading-tight">
                            NOT ALL MESSAGES REQUIRE SOUND.
                        </p>
                        <p className="text-xs md:text-sm font-medium tracking-wide text-foreground leading-tight">
                            SOME REQUIRE RESTRAINT.
                        </p>
                        <p className="text-xs md:text-sm font-medium tracking-wide text-foreground leading-tight">
                            WHAT IS BEING COMMUNICATED?
                        </p>
                    </div>
                </div>

                <div className="flex-1 flex flex-col items-center min-h-0 pt-2">
                <div className="w-full max-w-xl flex-shrink-1">
                    <video 
                        controls 
                        muted
                        controlsList="nodownload nofullscreen noplaybackrate"
                        disablePictureInPicture
                        className="w-full h-auto max-h-[250px] rounded-lg border-2 border-primary/30 shadow-lg [&::-webkit-media-controls-volume-slider]:hidden [&::-webkit-media-controls-mute-button]:hidden [&::-webkit-media-controls-volume-control-container]:hidden"
                        src="/z070h4fejhrmr0cw3ppt8649t0_result_.mp4"
                        style={{ pointerEvents: 'auto' }}
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>
                
                <div className="mt-6 mb-2">
                    <p className="text-xs font-['Press_Start_2P'] text-gray-500 text-center animate-pulse">
                        YOU ARE LISTENING TOO HARD.
                    </p>
                </div>

                <div className="w-full max-w-md flex-shrink-0 mt-4">
                    <AnswerInput
                    onSubmit={(a) => onSolve(a)}
                    successMessage={"ABSENCE CONFIRMED.\nMESSAGE RECEIVED.\nLAYER 04 BREACHED."}
                    errorMessage={"YOU ARE SEARCHING FOR NOISE.\nRECONSIDER."}
                    withExecuteButton={true}
                    feedbackPlacement="top"
                />
                </div>
                </div>
            </div>
        </div>
    );
};
