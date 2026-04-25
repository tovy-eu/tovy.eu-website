import { sendGTMEvent } from "@/lib/gtm";
import { getVisitorId, getTraceId } from "@/lib/tracking";

// ... (rest of the imports)

// ... (inside the ProjectIntakeForm component)

  const onSubmit = (data: ProjectRequestData) => {
    startTransition(async () => {
      try {
        const { score, path } = calculateScore(data);
        const visitorId = getVisitorId();
        const traceId = getTraceId();
        
        await addDoc(collection(db, "project_requests"), {
          ...data,
          timestamp: new Date(),
          lead_score: score,
          routing_path: path,
          visitor_id: visitorId,
          trace_id: traceId,
        });

        sendGTMEvent({
          event: "project_request",
          action: "form_submit",
          category: "engagement",
          label: "Project Intake Form",
          trace_id: traceId,
          visitor_id: visitorId,
          lead_score: score,
          routing_path: path,
        });

        localStorage.removeItem(STORAGE_KEY);
        setRoutingPath(path);
        setSubmittedValues(data);
        setFormSubmitted(true);
      } catch (error: any) {
        toast({
          title: dict?.common.submissionFailed || "Submission Failed",
          description: error.message || "There was an error submitting your request.",
          variant: "destructive",
        });
      }
    });
  };

// ... (rest of the component)