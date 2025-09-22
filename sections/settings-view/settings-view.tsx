'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const SettingsView = () => {
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
    <div className="space-y-8 p-6">
      {/* Step 1 */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">
          Step 1 - Loyalty Tier Model Selection
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
          Step 2 - Set Point Value Percentage
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
        <p className="text-muted-foreground mt-3 text-sm">
          This means each euro spent returns between{' '}
          <span className="font-medium">{pointValue}%</span> -{' '}
          <span className="font-medium">{pointValue + 5}%</span> of its value
          back in loyalty points (depending on the user&apos;s status and tier).
        </p>
      </div>
    </div>
  );
};

export default SettingsView;

// 'use client';

// import React, { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Label } from '@/components/ui/label';
// import { Input } from '@/components/ui/input';
// import { DropdownMenuRadioGroup } from '@/components/ui/dropdown-menu';
// import { Slider } from '@/components/ui/slider';

// const SettingsView = () => {
//   const [selectedModel, setSelectedModel] = useState('essential');
//   const [pointValue, setPointValue] = useState(5);

//   const loyaltyModels = [
//     {
//       value: 'essential',
//       title: 'Essential',
//       desc: 'Ideal for smaller venues like bars or casual spots. Lower entry requirements and more frequent rewards.',
//     },
//     {
//       value: 'preferred',
//       title: 'Preferred',
//       desc: 'Suitable for mid-range venues like restaurants or small clubs. Balanced tier requirements and reward frequency.',
//     },
//     {
//       value: 'premier',
//       title: 'Premier',
//       desc: 'Designed for premium venues such as high-end clubs or restaurants. Higher thresholds and slower progression.',
//     },
//   ];

//   return (
//     <div className="space-y-8 p-6">
//       {/* Step 1 */}
//       <div>
//         <h2 className="mb-4 text-xl font-semibold">
//           Step 1 - Loyalty Tier Model Selection
//         </h2>
//         <DropdownMenuRadioGroup
//           value={selectedModel}
//           onValueChange={setSelectedModel}
//           className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
//         >
//           {loyaltyModels.map((model) => (
//             <Card
//               key={model.value}
//               className={`dark:bg-secondary cursor-pointer gap-2 border ${
//                 selectedModel === model.value
//                   ? 'border-primary shadow-lg dark:border-gray-300'
//                   : 'border-muted'
//               }`}
//             >
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <DropdownMenuRadioGroup
//                     value={model.value}
//                     id={model.value}
//                     className="mt-0.5"
//                   />
//                   <Label
//                     htmlFor={model.value}
//                     className="cursor-pointer text-2xl"
//                   >
//                     {model.title}
//                   </Label>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-muted-foreground text-sm">{model.desc}</p>
//               </CardContent>
//             </Card>
//           ))}
//         </DropdownMenuRadioGroup>
//         <p className="text-muted-foreground mt-3 text-sm">
//           To switch your business model, please reach out to the admin team for
//           support.
//         </p>
//       </div>

//       {/* Step 2 */}
//       <div>
//         <h2 className="mb-4 text-xl font-semibold">
//           Step 2 – Set Point Value Percentage
//         </h2>
//         <div className="flex max-w-md items-center gap-4">
//           <Input
//             type="number"
//             min={1}
//             max={50}
//             value={pointValue}
//             onChange={(e) => setPointValue(Number(e.target.value))}
//             className="w-24"
//           />
//           <span className="font-medium">%</span>
//         </div>
//         <div className="mt-4 max-w-md">
//           <Slider
//             // defaultValue={[33]}
//             min={1}
//             max={50}
//             step={1}
//             value={[pointValue]}
//             onValueChange={(val) => setPointValue(val[0])}
//           />
//         </div>
//         <p className="text-muted-foreground mt-3 text-sm">
//           This means each euro spent returns between{' '}
//           <span className="font-medium">{pointValue}%</span> -{' '}
//           <span className="font-medium">{pointValue + 5}%</span> of its value
//           back in loyalty points (depending on the user&apos;s status and tier).
//         </p>
//       </div>
//     </div>
//   );
// };

// export default SettingsView;
