'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import React, { useState } from 'react';
import LinkedClubsView from './linked-clubs/linked-clubs-view';

const SettingsView = () => {
  const [clubTitle, setClubTitle] = useState('');
  const [selectedModel, setSelectedModel] = useState('essential');
  const [pointValue, setPointValue] = useState(5);

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

  const handleSave = () => {
    console.log('Selected Model:', selectedModel);
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
              className="h-12"
            />
          </div>

          <Button className="px-7" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>

      {/* Step 1 */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">
          Loyalty Tier Model Selection
        </h2>

        <RadioGroup
          value={selectedModel}
          onValueChange={setSelectedModel}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {loyaltyModels.map((model) => (
            <Card
              key={model.value}
              onClick={() => setSelectedModel(model.value)}
              className={`dark:bg-secondary cursor-pointer border transition ${
                selectedModel === model.value
                  ? 'border-primary shadow-lg dark:border-gray-300'
                  : 'border-muted'
              }`}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RadioGroupItem
                    value={model.value}
                    id={model.value}
                    className="mt-0.5"
                  />
                  <Label
                    htmlFor={model.value}
                    className="cursor-pointer text-2xl"
                  >
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
          <p className="text-muted-foreground text-sm">
            To switch your business model, please reach out to the admin team
            for support.
          </p>

          <div className="flex justify-end">
            <Button className="px-7" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Step 2 */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">
          Set Point Value Percentage
        </h2>
        <div className="flex max-w-md items-center gap-4">
          <Input
            type="number"
            min={1}
            max={20}
            value={pointValue}
            onChange={(e) => setPointValue(Number(e.target.value))}
            className="w-24"
          />
          <span className="font-medium">%</span>
        </div>
        <div className="mt-4 max-w-md">
          <Slider
            min={1}
            max={20}
            step={1}
            value={[pointValue]}
            onValueChange={(val) => setPointValue(val[0])}
          />
        </div>

        <div className="mt-5 flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            This means each euro spent returns between{' '}
            <span className="font-medium">{pointValue}%</span> -{' '}
            <span className="font-medium">{pointValue + 5}%</span> of its value
            back in loyalty points (depending on the user&apos;s status and
            tier).
          </p>

          <div className="flex justify-end">
            <Button className="px-7" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Step 3 */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Link Loyalty clubs</h2>

        {/* Search Bar */}
        <div className="mb-6 max-w-full">
          <Label htmlFor="searchClub" className="mb-2 block">
            Search Loyalty Clubs
          </Label>
          <div className="flex gap-2">
            <Input
              id="searchClub"
              type="text"
              placeholder="Enter club name..."
              className="mt-2 h-12 flex-1 bg-[##171717] placeholder:text-slate-400 dark:bg-[#171717]"
            />
          </div>
        </div>

        <LinkedClubsView tableName="Currently Linked Clubs" />
        <LinkedClubsView tableName="Incoming Requests" />
      </div>
    </div>
  );
};

export default SettingsView;
