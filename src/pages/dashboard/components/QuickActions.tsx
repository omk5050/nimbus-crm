import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Card } from '@/components/cards/Card';
import { QUICK_ACTIONS } from '@/constants/quickActions.constants';

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold text-foreground">Quick actions</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {QUICK_ACTIONS.map((action) => (
          <motion.button
            key={action.id}
            type="button"
            onClick={() => navigate(action.path)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="text-left"
          >
            <Card className="flex h-full flex-col gap-3 transition-colors hover:border-primary/40 hover:bg-accent/40">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-accent-foreground">
                <action.icon size={17} />
              </span>
              <div>
                <p className="text-sm font-medium text-card-foreground">{action.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{action.description}</p>
              </div>
            </Card>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
