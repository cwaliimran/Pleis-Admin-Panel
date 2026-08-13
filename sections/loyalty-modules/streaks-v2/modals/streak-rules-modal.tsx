'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFSelectField } from '@/components/rhf';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getErrorMessage } from '@/utils/api';
import { showError } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import StreakThresholdField from '../components/streak-threshold-field';
import { DEFAULT_STREAK_COUNT_BASE, STREAK_BADGE_LABELS, STREAK_BADGE_ORDER, STREAK_COUNT_BASE_NOUN, STREAK_COUNT_BASE_OPTIONS } from '../constants';
import { StreakCountBase, StreakRules } from '../types';

interface StreakRulesFormValues {
  countBase: StreakCountBase;
  bronze: string;
  silver: string;
  gold: string;
  platinum: string;
}

const positiveThreshold = (label: string) =>
  yup
    .string()
    .required(`${label} threshold is required`)
    .test('is-positive', `${label} threshold must be greater than 0`, (value) => Number(value) > 0);

const schema = yup.object({
  countBase: yup.string().required('Count base is required'),
  bronze: positiveThreshold('Bronze'),
  silver: positiveThreshold('Silver'),
  gold: positiveThreshold('Gold'),
  platinum: positiveThreshold('Platinum'),
});

const toFormValues = (rules: StreakRules | null): StreakRulesFormValues => ({
  countBase: rules?.countBase ?? DEFAULT_STREAK_COUNT_BASE,
  bronze: rules ? String(rules.thresholds.bronze) : '',
  silver: rules ? String(rules.thresholds.silver) : '',
  gold: rules ? String(rules.thresholds.gold) : '',
  platinum: rules ? String(rules.thresholds.platinum) : '',
});

interface StreakRulesModalProps {
  open: boolean;
  rules: StreakRules | null;
  isSubmitting?: boolean;
  onSubmit: (rules: StreakRules) => Promise<void>;
  onClose: () => void;
}

export const StreakRulesModal: React.FC<StreakRulesModalProps> = ({ open, rules, isSubmitting = false, onSubmit, onClose }) => {
  const methods = useForm<StreakRulesFormValues>({
    resolver: yupResolver(schema) as never,
    defaultValues: toFormValues(rules),
  });

  const { watch, reset, handleSubmit, setError } = methods;

  const countBase = watch('countBase');

  useEffect(() => {
    if (!open) return;

    reset(toFormValues(rules));
  }, [open, rules, reset]);

  const submit = async (values: StreakRulesFormValues) => {
    const thresholds = {
      bronze: Number(values.bronze),
      silver: Number(values.silver),
      gold: Number(values.gold),
      platinum: Number(values.platinum),
    };

    for (let index = 1; index < STREAK_BADGE_ORDER.length; index += 1) {
      const badge = STREAK_BADGE_ORDER[index];
      const previous = STREAK_BADGE_ORDER[index - 1];

      if (thresholds[badge] <= thresholds[previous]) {
        setError(badge, {
          type: 'manual',
          message: `Must be higher than ${STREAK_BADGE_LABELS[previous]} (${thresholds[previous]})`,
        });
        return;
      }
    }

    try {
      await onSubmit({ countBase: values.countBase, thresholds });
      onClose();
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const handleClose = () => {
    reset(toFormValues(rules));
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent aria-describedby={undefined} className="dark:bg-secondary flex max-h-[90vh] w-full flex-col overflow-y-auto sm:max-w-125!">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">Streak Rules</DialogTitle>
        </DialogHeader>

        <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5 dark:border-blue-900/60 dark:bg-blue-900/20">
          <p className="text-xs leading-relaxed text-blue-800 dark:text-blue-200">
            💡 Set how streaks are counted and at what visit counts users earn each badge. Applies globally to all members.
            {!rules && <span className="font-semibold"> No rules are configured yet — saving will create them.</span>}
          </p>
        </div>

        <FormProvider methods={methods} onSubmit={handleSubmit(submit)}>
          <div className="flex flex-col gap-4">
            <div>
              <RHFSelectField
                name="countBase"
                label="Count Base"
                placeholder="Select count base"
                className="w-full"
                options={STREAK_COUNT_BASE_OPTIONS}
              />

              <p className="mt-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                A user&apos;s streak increases by 1 each <span className="font-semibold">{STREAK_COUNT_BASE_NOUN[countBase]}</span> they visit.
                Missing a period resets the streak.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-[11px] font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">Badge thresholds</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Consecutive visits a user needs to earn each badge.</p>

              <div className="mt-1 flex flex-col gap-3">
                {STREAK_BADGE_ORDER.map((badge) => (
                  <StreakThresholdField key={badge} name={badge} badge={badge} disabled={isSubmitting} />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center gap-3">
            <Button type="button" variant="outline" className="cursor-pointer px-6" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>

            {isSubmitting ? (
              <Button type="button" disabled className="bg-primary hover:bg-primary cursor-not-allowed px-6 text-white">
                <ButtonLoading title="Saving" />
              </Button>
            ) : (
              <Button type="submit" className="bg-primary hover:bg-primary-dark cursor-pointer px-6 text-white">
                Save Rules
              </Button>
            )}
          </div>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default StreakRulesModal;
