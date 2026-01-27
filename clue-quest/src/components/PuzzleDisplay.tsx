import { motion } from "framer-motion";

interface PuzzleDisplayProps {
    title: string;
    content: string;
    hint?: string;
    imageUrl?: string;
}

export const PuzzleDisplay = ({ title, content, hint, imageUrl }: PuzzleDisplayProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl mx-auto"
        >
            <div className="relative border-8 border-border rounded-lg bg-card overflow-hidden shadow-2xl glow-primary">
                {/* Background Image within the box */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
                    style={{ backgroundImage: "url('/intro-bg.png')" }}
                />
                <div className="absolute inset-0 bg-black/60" />

                <div className="relative z-10 font-['Press_Start_2P']">
                    {/* Header */}
                    <div className="px-6 py-4 border-b-4 border-primary/20 bg-primary/10">
                        <h3 className="text-[10px] md:text-sm uppercase tracking-widest text-primary animate-pulse">
                            {title}
                        </h3>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-10 space-y-8">
                        {imageUrl && (
                            <div className="relative aspect-video rounded-md overflow-hidden border-4 border-primary/30">
                                <img
                                    src={imageUrl}
                                    alt="Puzzle clue"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 scanline opacity-20" />
                            </div>
                        )}

                        <div className="text-foreground leading-relaxed text-xs md:text-sm tracking-wide uppercase">
                            {content}
                        </div>

                        {hint && (
                            <div className="pt-6 border-t-4 border-primary/10">
                                <p className="text-[8px] uppercase tracking-widest text-primary/60 mb-3">
                                    [ HINT_PROTOCOL ]
                                </p>
                                <p className="text-[10px] text-muted-foreground italic leading-loose">
                                    {hint}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
