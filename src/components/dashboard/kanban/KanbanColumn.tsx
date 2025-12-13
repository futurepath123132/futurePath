import { Droppable } from "@hello-pangea/dnd";
import ApplicationCard from "./ApplicationCard";

interface ColumnProps {
    id: string;
    title: string;
    applications: any[];
    onDelete: (id: string) => void;
}

const statusColors: Record<string, string> = {
    interested: "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400",
    applying: "bg-yellow-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-400",
    submitted: "bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400",
    interview: "bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400",
    accepted: "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400",
    rejected: "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400",
};

export default function KanbanColumn({ id, title, applications, onDelete }: ColumnProps) {
    return (
        <div className="flex flex-col h-full min-w-[280px] w-[280px]">
            <div className={`p-3 rounded-t-lg border-b-2 flex items-center justify-between ${statusColors[id] || "bg-muted"}`}>
                <h3 className="font-semibold text-sm uppercase tracking-wide">
                    {title}
                </h3>
                <span className="text-xs font-bold bg-background/50 px-2 py-0.5 rounded-full">
                    {applications.length}
                </span>
            </div>

            <div className="flex-1 bg-muted/30 dark:bg-muted/10 rounded-b-lg border border-t-0 p-2 overflow-y-auto min-h-[500px]">
                <Droppable droppableId={id}>
                    {(provided, snapshot) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`h-full min-h-[100px] transition-colors rounded-md ${snapshot.isDraggingOver ? "bg-primary/5 ring-2 ring-primary/20 ring-inset" : ""
                                }`}
                        >
                            {applications.map((app, index) => (
                                <ApplicationCard
                                    key={app.id}
                                    application={app}
                                    index={index}
                                    onDelete={onDelete}
                                />
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        </div>
    );
}
