import { useState, useEffect } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import KanbanColumn from "./KanbanColumn";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface KanbanBoardProps {
    userId: string;
}

const COLUMNS = [
    { id: "interested", title: "Interested" },
    { id: "applying", title: "Applying" },
    { id: "submitted", title: "Submitted" },
    { id: "accepted", title: "Accepted" },
    { id: "rejected", title: "Rejected" },
];

import ApplicationTable from "./ApplicationTable";

export default function KanbanBoard({ userId }: KanbanBoardProps) {
    const [applications, setApplications] = useState<any[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        fetchApplications();

        // Subscribe to realtime changes
        const channel = supabase
            .channel('public:applications')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'applications', filter: `user_id=eq.${userId}` }, (payload) => {
                fetchApplications();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]);

    const fetchApplications = async () => {
        const { data, error } = await supabase
            .from("applications" as any)
            .select(`
        *,
        university:universities (
          id,
          name,
          city,
          icon_url,
          application_deadline
        )
      `)
            .eq("user_id", userId);

        if (error) {
            console.error("Error fetching applications:", error);
        } else {
            setApplications(data || []);
        }
    };

    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) return;

        // Optimistic Update
        const newStatus = destination.droppableId;
        const oldApplications = [...applications];

        setApplications((prev) =>
            prev.map((app) =>
                app.id === draggableId ? { ...app, status: newStatus } : app
            )
        );

        // API Update
        const { error } = await supabase
            .from("applications" as any)
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq("id", draggableId);

        if (error) {
            // Revert on error
            setApplications(oldApplications);
            toast({
                variant: "destructive",
                title: "Update failed",
                description: "Could not move application. Please try again.",
            });
        }
    };

    const handleDelete = async (id: string) => {
        // Optimistic
        setApplications(prev => prev.filter(app => app.id !== id));

        const { error } = await supabase
            .from("applications" as any)
            .delete()
            .eq("id", id);

        if (error) {
            fetchApplications(); // Re-fetch to revert
            toast({
                variant: "destructive",
                title: "Delete failed",
                description: error.message
            });
        } else {
            toast({ title: "Application removed" });
        }
    }

    return (
        <div className="h-full flex flex-col gap-8">
            <div className="h-[600px] overflow-x-auto pb-4">
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex gap-4 min-w-max h-full">
                        {COLUMNS.map((col) => (
                            <KanbanColumn
                                key={col.id}
                                id={col.id}
                                title={col.title}
                                applications={applications.filter((app) => app.status === col.id)}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                </DragDropContext>
            </div>

            <div className="flex-1">
                <h3 className="text-xl font-bold mb-4">Detailed View</h3>
                <ApplicationTable
                    applications={applications}
                    userId={userId}
                    onRefresh={fetchApplications}
                />
            </div>
        </div>
    );
}
