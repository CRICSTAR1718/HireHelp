import { Check, X, ClipboardCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DataTable, PageHeader, ContentCard, StatusBadge } from "../../../components/admin/common";
import { Button, Dialog, Label, Textarea } from "../../../components/admin/ui";
import { useApprovals, useApproveApproval, useRejectApproval } from "../../../hooks/admin/queries";
import { approvalDecisionSchema } from "../../../schemas/admin/approvals";
import type { Approval } from "../../../types/admin/approvals";
import type { Column } from "../../../components/admin/common/DataTable";

export const ApprovalsPage = () => {
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);
  const [decisionType, setDecisionType] = useState<"approve" | "reject">("approve");

  const { data: approvals, isLoading } = useApprovals();
  const approveApproval = useApproveApproval();
  const rejectApproval = useRejectApproval();

  const form = useForm({
    resolver: zodResolver(approvalDecisionSchema),
    defaultValues: {
      comments: "",
    },
  });

  const handleDecision = form.handleSubmit(async (data) => {
    if (selectedApproval) {
      if (decisionType === "approve") {
        await approveApproval.mutateAsync({ id: selectedApproval.id, input: data });
      } else {
        await rejectApproval.mutateAsync({ id: selectedApproval.id, input: data });
      }
      setIsDecisionModalOpen(false);
      setSelectedApproval(null);
      form.reset();
    }
  });

  const openDecisionModal = (approval: Approval, type: "approve" | "reject") => {
    setSelectedApproval(approval);
    setDecisionType(type);
    form.reset({ comments: "" });
    setIsDecisionModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusTone = (status: string) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "warning";
      case "pending":
        return "info";
      default:
        return "neutral";
    }
  };

  const columns: Column<Approval>[] = [
    {
      key: "requester",
      header: "Requester",
      cell: (row) => row.requesterName,
    },
    {
      key: "type",
      header: "Type",
      cell: (row) => row.type,
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => <StatusBadge label={row.status} tone={getStatusTone(row.status)} />,
    },
    {
      key: "requestedAt",
      header: "Requested",
      cell: (row) => formatDate(row.requestedAt),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (row) =>
        row.status === "pending" ? (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => openDecisionModal(row, "approve")}
            >
              <Check className="mr-1 h-4 w-4" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => openDecisionModal(row, "reject")}
            >
              <X className="mr-1 h-4 w-4" />
              Reject
            </Button>
          </div>
        ) : (
          <span className="text-sm text-slate-500">—</span>
        ),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader description="Review requisition approval workflow decisions." title="Approvals" />

      <ContentCard title="All Approvals">
        <DataTable
          columns={columns}
          data={approvals || []}
          loading={isLoading}
          emptyIcon={<ClipboardCheck />}
          emptyMessage="No approvals found. Pending approval requests will appear here."
        />
      </ContentCard>

      <Dialog
        description={`Add optional comments for this ${decisionType} decision.`}
        onClose={() => {
          setIsDecisionModalOpen(false);
          setSelectedApproval(null);
          form.reset();
        }}
        open={isDecisionModalOpen}
        title={`${decisionType === "approve" ? "Approve" : "Reject"} Approval`}
      >
        <form className="space-y-4" onSubmit={handleDecision}>
          <div>
            <Label htmlFor="comments">Comments (Optional)</Label>
            <Textarea
              {...form.register("comments")}
              id="comments"
              placeholder="Add any notes or context for this decision..."
            />
            {form.formState.errors.comments && (
              <p className="mt-1 text-sm text-red-600">{form.formState.errors.comments.message}</p>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              onClick={() => setIsDecisionModalOpen(false)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={decisionType === "approve" ? approveApproval.isPending : rejectApproval.isPending}
              type="submit"
              variant={decisionType === "approve" ? "default" : "secondary"}
            >
              {decisionType === "approve" ? (
                approveApproval.isPending ? (
                  "Approving..."
                ) : (
                  "Confirm Approval"
                )
              ) : rejectApproval.isPending ? (
                "Rejecting..."
              ) : (
                "Confirm Rejection"
              )}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
