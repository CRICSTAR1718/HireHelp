import { SectionTitle } from "../../../components/admin/common";
import { useParams } from "react-router-dom";
import JobFilters from "../../../components/candidate/jobs/JobFilters";
import FeaturedJobs from "../../../components/candidate/jobs/FeaturedJobs";

export default function Jobs() {
    const { jobId } = useParams();

    return (
        <div className="space-y-8">
            <SectionTitle
                description="Discover opportunities matching your profile."
                title="Jobs"
            />

            <JobFilters />

            <FeaturedJobs initialSelectedJobId={jobId ?? null} />
        </div>
    );
}
