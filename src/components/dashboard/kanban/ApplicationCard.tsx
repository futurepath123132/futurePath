import { Draggable } from "@hello-pangea/dnd";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { University as UniIcon, X, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface Application {
    id: string;
    university_id: string;
    status: string;
    notes?: string;
    university: {
        id: string;
        name: string;
        city: string;
        icon_url?: string;
        application_deadline?: string;
    };
}

interface ApplicationCardProps {
    application: Application;
    index: number;
    onDelete: (id: string) => void;
}

export default function ApplicationCard({ application, index, onDelete }: ApplicationCardProps) {
    const uni = application.university;

    return (
        <Draggable draggableId={application.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="mb-3"
                    style={{ ...provided.draggableProps.style }}
                >
                    <Card
                        className={`
              relative group bg-card hover:shadow-md transition-all border-border
              ${snapshot.isDragging ? "shadow-lg ring-2 ring-primary rotate-2" : ""}
            `}
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(application.id);
                            }}
                        >
                            <X className="h-3 w-3" />
                        </Button>

                        <CardContent className="p-3 space-y-2">
                            <Link to={`/universities/${uni.id}`} className="flex items-start gap-3 hover:opacity-80 transition-opacity">
                                <div className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center shrink-0 overflow-hidden p-1">
                                    {uni.icon_url ? (
                                        <img src={uni.icon_url} alt={uni.name} className="w-full h-full object-contain" />
                                    ) : (
                                        <UniIcon className="w-5 h-5 text-muted-foreground" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm leading-tight line-clamp-2 text-foreground">
                                        {uni.name}
                                    </h4>
                                    <p className="text-xs text-muted-foreground truncate mt-0.5">{uni.city}</p>
                                </div>
                            </Link>

                            {uni.application_deadline && (
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1 border-t border-border/50">
                                    <Calendar className="w-3 h-3" />
                                    <span className={new Date(uni.application_deadline) < new Date() ? "text-destructive font-medium" : ""}>
                                        Deadline: {format(new Date(uni.application_deadline), "MMM d")}
                                    </span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </Draggable>
    );
}
