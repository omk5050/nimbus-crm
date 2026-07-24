import { Check, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/buttons/Button';
import type { LeadStage } from '@/types/lead.types';
import { LEAD_PIPELINE_STAGES, LEAD_STAGE_LABEL } from '@/constants/lead.constants';
import { cn } from '@/utils/cn';

interface LeadStageStepperProps {
  stage: LeadStage;
  onChange: (stage: LeadStage) => void;
}

export function LeadStageStepper({ stage, onChange }: LeadStageStepperProps) {
  const isClosed = stage === 'won' || stage === 'lost';
  const activeIndex = LEAD_PIPELINE_STAGES.indexOf(stage);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center">
        {LEAD_PIPELINE_STAGES.map((pipelineStage, index) => {
          const isComplete = !isClosed && index < activeIndex;
          const isCurrent = !isClosed && index === activeIndex;
          const isLast = index === LEAD_PIPELINE_STAGES.length - 1;

          return (
            <div key={pipelineStage} className="flex flex-1 items-center last:flex-none">
              <button
                type="button"
                onClick={() => onChange(pipelineStage)}
                className="flex flex-col items-center gap-1.5"
              >
                <span
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors',
                    isComplete && 'border-primary bg-primary text-primary-foreground',
                    isCurrent && 'border-primary text-primary',
                    !isComplete && !isCurrent && 'border-border text-muted-foreground',
                  )}
                >
                  {isComplete ? <Check size={13} /> : index + 1}
                </span>
                <span
                  className={cn(
                    'text-xs font-medium',
                    isCurrent || isComplete ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {LEAD_STAGE_LABEL[pipelineStage]}
                </span>
              </button>
              {!isLast && (
                <span className={cn('mx-2 h-0.5 flex-1', isComplete ? 'bg-primary' : 'bg-border')} />
              )}
            </div>
          );
        })}
      </div>

      {isClosed ? (
        <div
          className={cn(
            'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium',
            stage === 'won' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive',
          )}
        >
          {stage === 'won' ? <ThumbsUp size={15} /> : <ThumbsDown size={15} />}
          Marked as {LEAD_STAGE_LABEL[stage]}
        </div>
      ) : (
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => onChange('won')}>
            <ThumbsUp size={14} />
            Mark as Won
          </Button>
          <Button variant="secondary" size="sm" onClick={() => onChange('lost')}>
            <ThumbsDown size={14} />
            Mark as Lost
          </Button>
        </div>
      )}
    </div>
  );
}
