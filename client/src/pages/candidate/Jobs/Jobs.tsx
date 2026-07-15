import PageTitle from "../../../components/candidate/ui/PageTitle";
import JobFilters from "../../../components/candidate/jobs/JobFilters";
import FeaturedJobs from "../../../components/candidate/jobs/FeaturedJobs";

export default function Jobs() {
    return (
        <div className="space-y-8">
            <PageTitle
                title="Jobs"
                subtitle="Discover opportunities matching your profile."
            />

            <JobFilters />

            <FeaturedJobs />
        </div>
    );
}
