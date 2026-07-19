import { SectionTitle } from "../../../components/admin/common";
import JobFilters from "../../../components/candidate/jobs/JobFilters";
import FeaturedJobs from "../../../components/candidate/jobs/FeaturedJobs";

export default function Jobs() {
    return (
        <div className="mx-auto max-w-7xl space-y-8">
            <SectionTitle
                description="Discover opportunities matching your profile."
                title="Jobs"
            />

            <JobFilters />

            <FeaturedJobs />
        </div>
    );
}
