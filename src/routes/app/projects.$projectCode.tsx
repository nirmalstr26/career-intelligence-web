import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Code,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Github,
  Database,
  FileCode,
  ShieldCheck,
  HelpCircle,
  Clock,
  Layers,
  ChevronRight,
  Save,
  Send,
  Loader2,
  RefreshCw,
  Award,
  BookOpen,
} from "lucide-react";
import {
  useProjectDetail,
  useStartProject,
  useSaveProjectStage,
  useSubmitProject,
  useStudentId,
} from "@/lib/careerai/hooks";
import { ProjectDetail, ProjectSubmission } from "@/lib/careerai/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/projects/$projectCode")({
  component: ProjectWorkspacePage,
});

type StageKey = "understand" | "design" | "build" | "test" | "explain" | "review";

const STAGES: { key: StageKey; label: string; number: number }[] = [
  { key: "understand", label: "1. Understand", number: 1 },
  { key: "design", label: "2. Design", number: 2 },
  { key: "build", label: "3. Build", number: 3 },
  { key: "test", label: "4. Test", number: 4 },
  { key: "explain", label: "5. Explain", number: 5 },
  { key: "review", label: "6. AI Review", number: 6 },
];

function ProjectWorkspacePage() {
  const { projectCode } = Route.useParams();
  const navigate = useNavigate();
  const studentId = useStudentId();
  const projectQuery = useProjectDetail(projectCode);
  const startMutation = useStartProject();
  const saveMutation = useSaveProjectStage();
  const submitMutation = useSubmitProject();

  const project = projectQuery.data;

  const [activeStage, setActiveStage] = useState<StageKey>("understand");

  // Stage form states initialized from project.stage_data
  const [understandForm, setUnderstandForm] = useState({
    problem_summary: "",
    key_challenges: "",
  });

  const [designForm, setDesignForm] = useState({
    architecture_summary: "",
    source_type: "CSV and JSON Batch Files",
    transformations: "",
    target_store: "PostgreSQL / DuckDB",
    validation_strategy: "",
  });

  const [buildForm, setBuildForm] = useState({
    github_repo_url: "",
    implementation_notes: "",
    checklist: [
      "Repository initialized with README and .gitignore",
      "Raw file ingestion module implemented",
      "Data transformation and cleansing logic written",
      "Analytical SQL aggregations created",
      "Automated data-quality validation rules added",
    ],
  });

  const [testForm, setTestForm] = useState({
    valid_records_proof: "",
    invalid_records_proof: "",
    duplicates_proof: "",
    missing_values_proof: "",
  });

  const [explainForm, setExplainForm] = useState({
    design_rationale: "",
    bad_data_handling: "",
    scaling_strategy: "",
    scheduling_strategy: "",
    monitoring_strategy: "",
  });

  // Populate draft data from server when loaded
  useEffect(() => {
    if (project && project.stage_data) {
      const d = project.stage_data;
      if (d.understand) setUnderstandForm((prev) => ({ ...prev, ...d.understand }));
      if (d.design) setDesignForm((prev) => ({ ...prev, ...d.design }));
      if (d.build) setBuildForm((prev) => ({ ...prev, ...d.build }));
      if (d.test) setTestForm((prev) => ({ ...prev, ...d.test }));
      if (d.explain) setExplainForm((prev) => ({ ...prev, ...d.explain }));

      if (project.state === "COMPLETED" || project.state === "NEEDS_IMPROVEMENT" || project.state === "SUBMITTED") {
        setActiveStage("review");
      } else if (project.current_stage) {
        setActiveStage(project.current_stage as StageKey);
      }
    }
  }, [project]);

  if (projectQuery.isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold">Project Not Found</h2>
        <p className="text-muted-foreground mt-2">The requested project could not be found.</p>
        <Link to="/app/practice" className="mt-4 inline-block text-primary underline">
          Back to Practice Hub
        </Link>
      </div>
    );
  }

  async function handleStart() {
    await startMutation.mutateAsync(projectCode);
    setActiveStage("understand");
  }

  async function handleSaveStage(stage: StageKey, nextStage?: StageKey) {
    let dataToSave: Record<string, any> = {};
    if (stage === "understand") dataToSave = understandForm;
    if (stage === "design") dataToSave = designForm;
    if (stage === "build") dataToSave = buildForm;
    if (stage === "test") dataToSave = testForm;
    if (stage === "explain") dataToSave = explainForm;

    await saveMutation.mutateAsync({
      projectCode,
      stage,
      data: dataToSave,
    });

    if (nextStage) {
      setActiveStage(nextStage);
    }
  }

  async function handleSubmitEvaluation() {
    const fullPayload = {
      understand: understandForm,
      design: designForm,
      build: buildForm,
      test: testForm,
      explain: explainForm,
    };

    await submitMutation.mutateAsync({
      projectCode,
      payload: fullPayload,
    });

    setActiveStage("review");
  }

  const latestSub = project.latest_submission;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Breadcrumb Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Link to="/app/practice" className="hover:text-foreground">
              Practice
            </Link>
            <ChevronRight className="size-3" />
            <span>Projects</span>
            <ChevronRight className="size-3" />
            <span className="text-foreground font-medium">{project.title}</span>
          </div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl text-foreground flex items-center gap-2.5">
            <Code className="size-7 text-primary" />
            {project.title}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
            {project.career_cluster_code.replace("_", " ")}
          </Badge>
          <Badge variant="outline" className="text-xs bg-secondary">
            {project.difficulty}
          </Badge>
          <Badge
            className={`text-xs ${
              project.state === "COMPLETED"
                ? "bg-success/20 text-success border-success/30"
                : project.state === "NEEDS_IMPROVEMENT"
                ? "bg-warning/20 text-warning border-warning/30"
                : project.state === "IN_PROGRESS"
                ? "bg-primary/20 text-primary border-primary/30"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            {project.state.replace("_", " ")}
          </Badge>
        </div>
      </div>

      {/* Stage Stepper Navigation */}
      <div className="surface-panel rounded-2xl border border-border/80 p-2 flex overflow-x-auto gap-1">
        {STAGES.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setActiveStage(s.key)}
            className={`flex-1 min-w-[120px] rounded-xl px-3 py-2.5 text-xs font-semibold transition-all text-center flex items-center justify-center gap-1.5 ${
              activeStage === s.key
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <span>{s.label}</span>
          </button>
        ))}
      </div>

      {/* STAGE 1: UNDERSTAND */}
      {activeStage === "understand" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="surface-panel rounded-3xl border border-border/80 p-6 space-y-4">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <BookOpen className="size-4" />
              Business Scenario & Engineering Objectives
            </div>
            <p className="text-sm leading-relaxed text-foreground/90">{project.business_scenario}</p>

            <div className="border-t border-border/60 pt-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Requirements</h4>
              <ul className="space-y-1.5 text-xs text-foreground/90">
                {project.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Input Data Spec Preview */}
            <div className="border-t border-border/60 pt-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sample Input Data (CSV/JSON)</h4>
              <div className="rounded-xl bg-background border border-border/60 p-3 font-mono text-[11px] overflow-x-auto">
                <pre>{JSON.stringify(project.input_data_spec.sample_orders, null, 2)}</pre>
              </div>
            </div>

            {/* Expected Output Spec */}
            <div className="border-t border-border/60 pt-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Expected Analytics Tables / Views</h4>
              <div className="grid gap-2 sm:grid-cols-2">
                {project.expected_output_spec.tables_or_views?.map((tab: string, i: number) => (
                  <div key={i} className="rounded-xl bg-secondary/50 border border-border/40 p-2.5 text-xs flex items-center gap-2">
                    <Database className="size-3.5 text-primary shrink-0" />
                    <span className="font-mono text-[11px] truncate">{tab}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Student Understanding Input */}
          <div className="surface-panel rounded-3xl border border-border/80 p-6 space-y-4">
            <h3 className="font-display text-sm font-bold text-foreground">Your Problem Understanding</h3>
            <p className="text-xs text-muted-foreground">
              Briefly describe your understanding of the business problem, input data flow, and key challenges.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-foreground">Problem Summary & Goals</label>
                <textarea
                  rows={4}
                  value={understandForm.problem_summary}
                  onChange={(e) => setUnderstandForm({ ...understandForm, problem_summary: e.target.value })}
                  placeholder="The company receives daily batch files containing order transactions. The pipeline must ingest, clean, quarantine invalid records, and produce reporting marts for daily sales and customer rankings..."
                  className="mt-1.5 w-full rounded-2xl border border-border/80 bg-background p-3.5 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">Key Technical Challenges & Edge Cases</label>
                <textarea
                  rows={3}
                  value={understandForm.key_challenges}
                  onChange={(e) => setUnderstandForm({ ...understandForm, key_challenges: e.target.value })}
                  placeholder="Handling missing customer IDs, preventing duplicate order ingestion on re-runs, and ensuring schema consistency across CSV and JSON inputs..."
                  className="mt-1.5 w-full rounded-2xl border border-border/80 bg-background p-3.5 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="hero"
                onClick={() => void handleSaveStage("understand", "design")}
                disabled={saveMutation.isPending}
                className="rounded-xl text-xs gap-1.5"
              >
                Save & Proceed to Design
                <ArrowRight className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 2: DESIGN */}
      {activeStage === "design" && (
        <div className="surface-panel rounded-3xl border border-border/80 p-6 space-y-5 animate-in fade-in duration-200">
          <div>
            <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <Layers className="size-5 text-primary" />
              Architecture & Solution Design
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Define the modular pipeline stages, storage engines, transformation steps, and validation strategy.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-foreground">Source Format & Ingestion</label>
              <input
                type="text"
                value={designForm.source_type}
                onChange={(e) => setDesignForm({ ...designForm, source_type: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">Target Storage Store</label>
              <input
                type="text"
                value={designForm.target_store}
                onChange={(e) => setDesignForm({ ...designForm, target_store: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground">Pipeline Architecture & Flow</label>
            <textarea
              rows={4}
              value={designForm.architecture_summary}
              onChange={(e) => setDesignForm({ ...designForm, architecture_summary: e.target.value })}
              placeholder="1. Ingest raw CSV/JSON files from input directory. 2. Stage records into Pandas/DuckDB. 3. Apply schema validation & deduplication. 4. Quarantine invalid records. 5. Generate aggregate SQL summary tables..."
              className="mt-1.5 w-full rounded-2xl border border-border/80 bg-background p-3.5 text-xs text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground">Transformation & Cleansing Logic</label>
            <textarea
              rows={3}
              value={designForm.transformations}
              onChange={(e) => setDesignForm({ ...designForm, transformations: e.target.value })}
              placeholder="Cast dates to ISO format, calculate total_price = quantity * unit_price, aggregate daily sales by date, compute customer lifetime value..."
              className="mt-1.5 w-full rounded-2xl border border-border/80 bg-background p-3.5 text-xs text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground">Data Quality & Validation Strategy</label>
            <textarea
              rows={3}
              value={designForm.validation_strategy}
              onChange={(e) => setDesignForm({ ...designForm, validation_strategy: e.target.value })}
              placeholder="Check customer_id IS NOT NULL, unit_price > 0, quantity > 0, order_id unique. Route failed records to invalid_records_quarantine with failure reason..."
              className="mt-1.5 w-full rounded-2xl border border-border/80 bg-background p-3.5 text-xs text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex justify-between items-center pt-2">
            <Button variant="ghost" size="sm" onClick={() => setActiveStage("understand")} className="text-xs gap-1">
              <ArrowLeft className="size-3.5" /> Back
            </Button>
            <Button variant="hero" onClick={() => void handleSaveStage("design", "build")} className="rounded-xl text-xs gap-1.5">
              Save & Proceed to Build <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* STAGE 3: BUILD */}
      {activeStage === "build" && (
        <div className="surface-panel rounded-3xl border border-border/80 p-6 space-y-5 animate-in fade-in duration-200">
          <div>
            <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <Github className="size-5 text-primary" />
              Build & Implementation Checklist
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Build your modular Python & SQL data pipeline and provide your Git repository.
            </p>
          </div>

          {/* Interactive Checklist */}
          <div className="rounded-2xl border border-border/70 bg-background/50 p-4 space-y-2.5">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Implementation Checklist</h4>
            {buildForm.checklist.map((item, i) => (
              <label key={i} className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-border text-primary focus:ring-primary size-4" />
                <span>{item}</span>
              </label>
            ))}
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Github className="size-3.5 text-primary" /> GitHub Repository URL
            </label>
            <input
              type="url"
              value={buildForm.github_repo_url}
              onChange={(e) => setBuildForm({ ...buildForm, github_repo_url: e.target.value })}
              placeholder="https://github.com/username/simple-data-pipeline"
              className="mt-1.5 w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground">Implementation & Execution Notes</label>
            <textarea
              rows={4}
              value={buildForm.implementation_notes}
              onChange={(e) => setBuildForm({ ...buildForm, implementation_notes: e.target.value })}
              placeholder="Code structure: src/ingestion.py handles CSV/JSON reading, src/transforms.py cleans and validates records, sql/marts.sql builds analytics views..."
              className="mt-1.5 w-full rounded-2xl border border-border/80 bg-background p-3.5 text-xs text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex justify-between items-center pt-2">
            <Button variant="ghost" size="sm" onClick={() => setActiveStage("design")} className="text-xs gap-1">
              <ArrowLeft className="size-3.5" /> Back
            </Button>
            <Button variant="hero" onClick={() => void handleSaveStage("build", "test")} className="rounded-xl text-xs gap-1.5">
              Save & Proceed to Test <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* STAGE 4: TEST */}
      {activeStage === "test" && (
        <div className="surface-panel rounded-3xl border border-border/80 p-6 space-y-5 animate-in fade-in duration-200">
          <div>
            <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="size-5 text-primary" />
              Testing & Data Quality Evidence
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Provide test verification proving that your pipeline handles valid data, invalid formats, and duplicates.
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground">Valid Records & Output Verification</label>
            <textarea
              rows={3}
              value={testForm.valid_records_proof}
              onChange={(e) => setTestForm({ ...testForm, valid_records_proof: e.target.value })}
              placeholder="Processed 10,000 orders successfully. Output daily_sales_summary verified with total_revenue matching row sum. Top customer metrics accurately matched source."
              className="mt-1.5 w-full rounded-2xl border border-border/80 bg-background p-3.5 text-xs text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground">Invalid Records & Quarantine Testing</label>
            <textarea
              rows={3}
              value={testForm.invalid_records_proof}
              onChange={(e) => setTestForm({ ...testForm, invalid_records_proof: e.target.value })}
              placeholder="Injected 50 bad records (null customer_id, negative unit_price). All 50 were quarantined to invalid_records_quarantine without terminating pipeline run."
              className="mt-1.5 w-full rounded-2xl border border-border/80 bg-background p-3.5 text-xs text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground">Duplicate Handling & Idempotency Proof</label>
            <textarea
              rows={3}
              value={testForm.duplicates_proof}
              onChange={(e) => setTestForm({ ...testForm, duplicates_proof: e.target.value })}
              placeholder="Executed pipeline 3 times on identical input batch. Used primary key constraints (order_id, date) to ensure zero duplicate rows inserted."
              className="mt-1.5 w-full rounded-2xl border border-border/80 bg-background p-3.5 text-xs text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex justify-between items-center pt-2">
            <Button variant="ghost" size="sm" onClick={() => setActiveStage("build")} className="text-xs gap-1">
              <ArrowLeft className="size-3.5" /> Back
            </Button>
            <Button variant="hero" onClick={() => void handleSaveStage("test", "explain")} className="rounded-xl text-xs gap-1.5">
              Save & Proceed to Explain <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* STAGE 5: EXPLAIN */}
      {activeStage === "explain" && (
        <div className="surface-panel rounded-3xl border border-border/80 p-6 space-y-5 animate-in fade-in duration-200">
          <div>
            <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <HelpCircle className="size-5 text-primary" />
              Technical Explanation & Production Defense
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Answer the core engineering defense questions about scaling, monitoring, and production operations.
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground">1. Why did you choose this architecture & design?</label>
            <textarea
              rows={3}
              value={explainForm.design_rationale}
              onChange={(e) => setExplainForm({ ...explainForm, design_rationale: e.target.value })}
              placeholder="Separating ingestion from SQL transformation allows independent testing of parsing and business rules. Using DuckDB/PostgreSQL gives columnar analytical querying..."
              className="mt-1.5 w-full rounded-2xl border border-border/80 bg-background p-3.5 text-xs text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground">2. How would this pipeline scale to 10M+ daily records?</label>
            <textarea
              rows={3}
              value={explainForm.scaling_strategy}
              onChange={(e) => setExplainForm({ ...explainForm, scaling_strategy: e.target.value })}
              placeholder="Partition input files by ingestion date/hour, leverage chunked processing or PySpark for distributed transforms, and write to Parquet in an object store before warehouse copy..."
              className="mt-1.5 w-full rounded-2xl border border-border/80 bg-background p-3.5 text-xs text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground">3. How would you schedule and monitor this in production?</label>
            <textarea
              rows={3}
              value={explainForm.scheduling_strategy}
              onChange={(e) => setExplainForm({ ...explainForm, scheduling_strategy: e.target.value })}
              placeholder="Schedule daily via Apache Airflow DAG with retries. Monitor run duration, row count anomalies, and alert on Slack/PagerDuty if failure rate exceeds 1%..."
              className="mt-1.5 w-full rounded-2xl border border-border/80 bg-background p-3.5 text-xs text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex justify-between items-center pt-2">
            <Button variant="ghost" size="sm" onClick={() => setActiveStage("test")} className="text-xs gap-1">
              <ArrowLeft className="size-3.5" /> Back
            </Button>
            <Button variant="hero" onClick={() => void handleSaveStage("explain", "review")} className="rounded-xl text-xs gap-1.5">
              Proceed to AI Review <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* STAGE 6: REVIEW & AI EVALUATION */}
      {activeStage === "review" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Submit Action Card */}
          <div className="surface-panel rounded-3xl border border-border/80 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                <Sparkles className="size-5 text-primary" />
                AI Rubric Review & Evaluation
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Your submission will be evaluated against the 8 industry rubric dimensions (Pass threshold: {project.min_pass_score}/100).
              </p>
            </div>

            <Button
              variant="hero"
              size="lg"
              onClick={() => void handleSubmitEvaluation()}
              disabled={submitMutation.isPending}
              className="rounded-2xl text-xs sm:text-sm font-semibold gap-2 shadow-md shrink-0"
            >
              {submitMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Evaluating with AI...
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  {latestSub ? "Re-evaluate Project" : "Submit for AI Evaluation"}
                </>
              )}
            </Button>
          </div>

          {/* Evaluation Results when available */}
          {latestSub && (
            <div className="space-y-6">
              {/* Score Header Card */}
              <div
                className={`surface-panel rounded-3xl border p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
                  latestSub.status === "COMPLETED"
                    ? "border-success/40 bg-success/5"
                    : "border-warning/40 bg-warning/5"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {latestSub.status === "COMPLETED" ? (
                      <CheckCircle2 className="size-6 text-success" />
                    ) : (
                      <AlertTriangle className="size-6 text-warning" />
                    )}
                    <h3 className="font-display text-xl font-bold text-foreground">
                      {latestSub.status === "COMPLETED" ? "Project Completed & Verified!" : "Needs Improvement"}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Attempt #{latestSub.attempt_number} • Evaluated {new Date(latestSub.submitted_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-3xl font-display font-black text-foreground">{latestSub.total_score}</div>
                    <div className="text-[11px] text-muted-foreground">out of 100</div>
                  </div>
                  <Badge
                    className={`text-xs px-3 py-1 ${
                      latestSub.status === "COMPLETED"
                        ? "bg-success text-success-foreground"
                        : "bg-warning text-warning-foreground"
                    }`}
                  >
                    {latestSub.status}
                  </Badge>
                </div>
              </div>

              {/* Rubric Score Breakdown Table */}
              <div className="surface-panel rounded-3xl border border-border/80 p-6 space-y-4">
                <h4 className="font-display text-sm font-bold text-foreground">Rubric Dimension Breakdown</h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  {latestSub.rubric_scores.map((r, i) => (
                    <div key={i} className="rounded-2xl border border-border/70 bg-background/60 p-4 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-foreground">{r.criterion_name}</span>
                        <span className="text-primary font-mono font-bold">
                          {r.score} / {r.max_score}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{r.feedback}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths & Required Improvements */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="surface-panel rounded-3xl border border-border/80 p-6 space-y-3">
                  <h4 className="font-display text-sm font-bold text-foreground flex items-center gap-1.5 text-success">
                    <CheckCircle2 className="size-4" /> Demonstrated Strengths
                  </h4>
                  <ul className="space-y-2 text-xs text-foreground/90">
                    {latestSub.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-success font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="surface-panel rounded-3xl border border-border/80 p-6 space-y-3">
                  <h4 className="font-display text-sm font-bold text-foreground flex items-center gap-1.5 text-warning">
                    <AlertTriangle className="size-4" /> Required Improvements (Top Fixes)
                  </h4>
                  <ul className="space-y-2 text-xs text-foreground/90">
                    {latestSub.required_improvements.map((imp, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-warning font-bold">•</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Technical Interview Questions */}
              <div className="surface-panel rounded-3xl border border-border/80 p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
                    <Sparkles className="size-4 text-primary" />
                    Interview Preparation Questions
                  </h4>
                  <Link
                    to="/app/coach"
                    search={{ prompt: `Can you interview me about my Data Pipeline project architecture and scaling choices?` }}
                    className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                  >
                    Practice with SPAR Coach <ArrowRight className="size-3" />
                  </Link>
                </div>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {latestSub.interview_questions.map((q, i) => (
                    <div key={i} className="rounded-2xl border border-border/60 bg-secondary/30 p-3.5 text-xs text-foreground leading-relaxed">
                      <span className="font-bold text-primary mr-1.5">Q{i + 1}:</span>
                      {q}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
