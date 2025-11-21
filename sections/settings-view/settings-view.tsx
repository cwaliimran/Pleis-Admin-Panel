'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { useGetCompanyListQuery, useUpdateUserMutation } from '@/store/Reducer/user-list';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { useEffect, useState } from 'react';
import LinkedClubs from './linked-clubs/linked-clubs';

const SettingsView = () => {
  const [clubTitle, setClubTitle] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [pointValue, setPointValue] = useState(0);

  // Individual loading states for each section
  const [isSavingTitle, setIsSavingTitle] = useState(false);
  const [isSavingModel, setIsSavingModel] = useState(false);
  const [isSavingPointValue, setIsSavingPointValue] = useState(false);

  const [selectedCompanyId, setSelectedCompanyId] = useState<string | undefined>();
  const [selectedCompany, setSelectedCompany] = useState<any>(null);

  const [updateUser] = useUpdateUserMutation();

  const { data: companyList } = useGetCompanyListQuery({});

  useEffect(() => {
    const handleCompanyChange = () => {
      const stored = localStorage.getItem('selectedCompany');
      try {
        const company = stored ? JSON.parse(stored) : null;
        setSelectedCompanyId(company?.value);
      } catch (e) {
        console.error('Failed to parse selectedCompany from localStorage', e);
        setSelectedCompanyId(undefined);
      }
    };

    // Initial load
    handleCompanyChange();

    // Listen for changes
    window.addEventListener('companyChanged', handleCompanyChange);
    return () => window.removeEventListener('companyChanged', handleCompanyChange);
  }, []);

  // Find and set the selected company data from the company list
  useEffect(() => {
    if (!companyList || !selectedCompanyId) {
      setSelectedCompany(null);
      return;
    }

    const company = companyList.find((c: any) => c._id === selectedCompanyId);
    setSelectedCompany(company || null);
  }, [companyList, selectedCompanyId]);

  // Prefill form fields when selected company changes
  useEffect(() => {
    if (!selectedCompany) {
      setClubTitle('');
      setSelectedModel('');
      setPointValue(0);
      return;
    }

    const loyaltySettings = selectedCompany?.companyDetails?.loyaltySettings;

    if (loyaltySettings) {
      setClubTitle(loyaltySettings.title || '');
      setSelectedModel(loyaltySettings.model || '');
      setPointValue(loyaltySettings.pointValuePercentage || 0);
    } else {
      setClubTitle('');
      setSelectedModel('');
      setPointValue(0);
    }
  }, [selectedCompany]);

  const loyaltyModels = [
    {
      value: 'essential',
      title: 'Essential',
      desc: 'Ideal for smaller venues like bars or casual spots. Lower entry requirements and more frequent rewards.',
    },
    {
      value: 'preferred',
      title: 'Preferred',
      desc: 'Suitable for mid-range venues like restaurants or small clubs. Balanced tier requirements and reward frequency.',
    },
    {
      value: 'premier',
      title: 'Premier',
      desc: 'Designed for premium venues such as high-end clubs or restaurants. Higher thresholds and slower progression.',
    },
  ];

  // Save club title
  const handleSaveTitle = async () => {
    if (!selectedCompanyId) {
      showError('No company selected. Please select a company from the header dropdown.');
      return;
    }

    if (!clubTitle?.trim()) {
      showError('Please enter a club title.');
      return;
    }

    setIsSavingTitle(true);
    try {
      const body = {
        companyDetails: {
          loyaltySettings: {
            title: clubTitle,
          },
        },
      };

      const response = await updateUser({ id: selectedCompanyId, body }).unwrap();
      console.log('response', response);

      if (response.error) {
        const errorMessage = getErrorMessage(response.error);
        showError(errorMessage);
        return;
      }

      if (response?.message) {
        showSuccess(response?.message || 'Otp sent successfully');
      }
    } catch (error) {
      console.error('Error saving title:', error);
    } finally {
      setIsSavingTitle(false);
    }
  };

  // Save loyalty model
  const handleSaveModel = async () => {
    if (!selectedCompanyId) {
      showError('No company selected. Please select a company from the header dropdown.');
      return;
    }

    if (!selectedModel) {
      showError('Please select a loyalty model.');
      return;
    }

    setIsSavingModel(true);
    try {
      const body = {
        companyDetails: {
          loyaltySettings: {
            model: selectedModel,
          },
        },
      };

      const response = await updateUser({ id: selectedCompanyId, body }).unwrap();
      console.log('response', response);

      if (response.error) {
        const errorMessage = getErrorMessage(response.error);
        showError(errorMessage);
        return;
      }

      if (response?.message) {
        showSuccess(response?.message || 'Loyalty model updated successfully');
      }
    } catch (error) {
      console.error('Error saving model:', error);
      showError(getErrorMessage(error) || 'Failed to save loyalty model');
    } finally {
      setIsSavingModel(false);
    }
  };

  // Save point value percentage
  const handleSavePointValue = async () => {
    if (!selectedCompanyId) {
      showError('No company selected. Please select a company from the header dropdown.');
      return;
    }

    if (!pointValue || pointValue <= 0) {
      showError('Please set a valid point value percentage.');
      return;
    }

    setIsSavingPointValue(true);
    try {
      const body = {
        companyDetails: {
          loyaltySettings: {
            pointValuePercentage: pointValue,
          },
        },
      };

      const response = await updateUser({ id: selectedCompanyId, body }).unwrap();
      console.log('response', response);

      if (response.error) {
        const errorMessage = getErrorMessage(response.error);
        showError(errorMessage);
        return;
      }

      if (response?.message) {
        showSuccess(response?.message || 'Point value percentage updated successfully');
      }
    } catch (error) {
      console.error('Error saving point value:', error);
      showError(getErrorMessage(error) || 'Failed to save point value percentage');
    } finally {
      setIsSavingPointValue(false);
    }
  };

  return (
    <div className="space-y-7 p-6 sm:space-y-12">
      {/* Club Title Field */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Club Information</h2>
        <div className="flex w-full items-center justify-between gap-4">
          <div className="max-w-sm flex-1">
            <Input
              id="clubTitle"
              type="text"
              placeholder="Enter club title"
              value={clubTitle}
              onChange={(e) => setClubTitle(e.target.value)}
              className="h-12 w-full border border-gray-300 bg-white text-lg text-gray-900 placeholder:text-gray-500 dark:border-gray-700 dark:bg-[#171717] dark:text-gray-100 dark:placeholder:text-gray-500"
            />
          </div>

          <Button className="px-7" onClick={handleSaveTitle} disabled={isSavingTitle}>
            {isSavingTitle ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Step 1 - Loyalty Model */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Loyalty Tier Model Selection</h2>

        <RadioGroup value={selectedModel} onValueChange={setSelectedModel} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loyaltyModels.map((model) => (
            <Card
              key={model.value}
              onClick={() => setSelectedModel(model.value)}
              className={`dark:bg-secondary cursor-pointer border transition ${
                selectedModel === model.value ? 'border-primary shadow-lg dark:border-gray-300' : 'border-muted'
              }`}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RadioGroupItem value={model.value} id={model.value} className="mt-0.5" />
                  <Label htmlFor={model.value} className="cursor-pointer text-2xl">
                    {model.title}
                  </Label>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{model.desc}</p>
              </CardContent>
            </Card>
          ))}
        </RadioGroup>

        <div className="mt-5 flex items-center justify-between">
          <p className="text-muted-foreground text-sm">To switch your business model, please reach out to the admin team for support.</p>

          <div className="flex justify-end">
            <Button className="px-7" onClick={handleSaveModel} disabled={isSavingModel}>
              {isSavingModel ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </div>

      {/* Step 2 - Point Value Percentage */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Set Point Value Percentage</h2>
        <div className="flex max-w-md items-center gap-4">
          <Input
            type="number"
            min={1}
            max={20}
            value={pointValue}
            onChange={(e) => setPointValue(Number(e.target.value))}
            className="w-24 border border-gray-400 bg-white text-gray-900 placeholder:text-gray-500 dark:border-gray-700 dark:bg-[#171717] dark:text-gray-100 dark:placeholder:text-gray-500"
          />
          <span className="font-medium">%</span>
        </div>
        <div className="mt-4 max-w-md">
          <Slider min={1} max={20} step={1} value={[pointValue]} onValueChange={(val) => setPointValue(val[0])} />
        </div>

        <div className="mt-5 flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            This means each euro spent returns between <span className="font-medium">{pointValue}%</span> -{' '}
            <span className="font-medium">{pointValue + 5}%</span> of its value back in loyalty points (depending on the user&apos;s status and tier).
          </p>

          <div className="flex justify-end">
            <Button className="px-7" onClick={handleSavePointValue} disabled={isSavingPointValue}>
              {isSavingPointValue ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </div>

      {/* Step 3 */}
      <LinkedClubs selectedCompanyId={selectedCompanyId} />
    </div>
  );
};

export default SettingsView;
