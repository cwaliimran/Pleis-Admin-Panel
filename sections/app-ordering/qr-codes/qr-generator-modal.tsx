'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import QRCode from 'qrcode';
import React, { useEffect, useRef, useState } from 'react';
import { QR_TYPE_CONFIG, SIZE_OPTIONS } from './constants';
import { QRCodeFormat, QRCodeSize, QRCodeType } from './types';

interface QRGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrType: QRCodeType | null;
}

export const QRGeneratorModal: React.FC<QRGeneratorModalProps> = ({ isOpen, onClose, qrType }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [label, setLabel] = useState('');
  const [color, setColor] = useState('#1d1d1f');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize] = useState<QRCodeSize>(512);
  const [currentUrl, setCurrentUrl] = useState('');

  const config = qrType ? QR_TYPE_CONFIG[qrType] : null;

  useEffect(() => {
    if (isOpen && config) {
      // Reset form when modal opens
      const initialData: Record<string, string> = {};
      config.fields.forEach((field) => {
        initialData[field.id] = '';
      });
      setFormData(initialData);
      setLabel('');
      setColor('#1d1d1f');
      setBgColor('#ffffff');
      setSize(512);
      setCurrentUrl('');
    }
  }, [isOpen, config]);

  useEffect(() => {
    updatePreview();
  }, [formData, label, color, bgColor, config]);

  const updatePreview = () => {
    if (!config || !canvasRef.current) return;

    // Check if all required fields are filled
    const isValid = config.fields.every((field) => !field.required || formData[field.id]);

    if (!isValid) {
      setCurrentUrl('');
      return;
    }

    // Generate URL
    const url = config.generateUrl(formData);
    setCurrentUrl(url);

    // Generate QR Code
    QRCode.toCanvas(canvasRef.current, url, {
      width: 300,
      margin: 2,
      color: {
        dark: color,
        light: bgColor,
      },
    });
  };

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const downloadQRCode = (format: QRCodeFormat) => {
    if (!currentUrl) {
      alert('Please fill in all required fields first');
      return;
    }

    const filename = label || 'QR-Code';

    if (format === 'svg') {
      QRCode.toString(currentUrl, {
        type: 'svg',
        width: size,
        margin: 2,
        color: {
          dark: color,
          light: bgColor,
        },
      }).then((svg) => {
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename.replace(/\s+/g, '-')}.svg`;
        a.click();
        URL.revokeObjectURL(url);
      });
    } else {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;

      QRCode.toCanvas(canvas, currentUrl, {
        width: size,
        margin: 2,
        color: {
          dark: color,
          light: bgColor,
        },
      }).then(() => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${filename.replace(/\s+/g, '-')}.${format}`;
              a.click();
              URL.revokeObjectURL(url);
            }
          },
          `image/${format === 'jpg' ? 'jpeg' : 'png'}`
        );
      });
    }
  };

  if (!isOpen || !config) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-5 pt-10 md:p-10" onClick={onClose}>
      <div className="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-xl md:p-7 dark:bg-[#222121]" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="mb-8 flex items-center justify-between border-b-2 border-gray-100 pb-5 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <div className="text-4xl">{config.icon}</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{config.title}</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">{config.subtitle}</p>
            </div>
          </div>
          <button
            title="close"
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-3xl text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="grid gap-10 lg:grid-cols-[1fr,400px]">
          {/* Configuration Section */}
          <div className="space-y-4">
            {config.fields.map((field) => (
              <div key={field.id}>
                <Label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-gray-100">{field.label}</Label>
                {field.type === 'text' ? (
                  <Input
                    type="text"
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    className="h-12 border-2"
                  />
                ) : (
                  <Select value={formData[field.id] || undefined} onValueChange={(value) => handleInputChange(field.id, value)}>
                    <SelectTrigger className="h-11! w-full border-2">
                      <SelectValue placeholder={field.placeholder || 'Select an option'} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options
                        ?.filter((option) => option.value !== '')
                        .map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.text}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}

            {/* Label */}
            <div>
              <Label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-gray-100">
                QR Code Label <span className="font-normal text-gray-500">(optional)</span>
              </Label>
              <Input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g., Main Entrance, Table 5"
                className="h-12 border-2"
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">This label will appear below the QR code when printed</p>
            </div>

            <div className="my-8 h-0.5 bg-gray-100 dark:bg-gray-800" />

            {/* Customization */}
            <div>
              <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100">🎨 Customization</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-gray-100">QR Code Color</Label>
                  <div className="flex items-center gap-3">
                    <input
                      title="Foreground Color"
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="h-11 w-15 cursor-pointer rounded-lg border-2"
                    />
                    <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">Foreground Color</span>
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-gray-100">Background Color</Label>
                  <div className="flex items-center gap-3">
                    <input
                      title="Background Color"
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="h-11 w-15 cursor-pointer rounded-lg border-2"
                    />
                    <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">Background Color</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Size */}
            <div>
              <Label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-gray-100">QR Code Size</Label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {SIZE_OPTIONS.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => setSize(option.value as QRCodeSize)}
                    className={`cursor-pointer rounded-lg border-2 p-3 transition-all ${
                      size === option.value
                        ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950'
                        : 'border-gray-200 hover:border-blue-300 dark:border-gray-700 dark:hover:border-blue-600'
                    }`}
                  >
                    <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{option.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">{option.dimensions}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="sticky top-5 flex flex-col items-center rounded-2xl bg-gray-50 p-8 dark:bg-[#1a1a1a]">
            <h3 className="mb-6 text-center text-base font-bold text-gray-900 dark:text-gray-100">QR Code Preview</h3>

            <div className="mb-6 flex flex-col items-center rounded-2xl bg-white p-8 shadow-lg dark:bg-[#222121]">
              <canvas ref={canvasRef} width="300" height="300" className="max-w-full" />
              <div className="mt-4 text-center text-sm font-semibold text-gray-900 dark:text-gray-100">{label || 'QR Code Label'}</div>
              <div className="mt-1 max-w-full text-center text-xs break-all text-gray-500 dark:text-gray-500">
                {currentUrl || 'Please fill in all required fields'}
              </div>
            </div>

            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
              <Button
                onClick={() => downloadQRCode('png')}
                className="h-11 gap-2 bg-green-600 font-semibold hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
              >
                ⬇️ Download PNG
              </Button>
              <Button onClick={() => downloadQRCode('jpg')} className="h-11 gap-2 font-semibold">
                ⬇️ Download JPG
              </Button>
              <Button onClick={() => downloadQRCode('svg')} variant="outline" className="h-11 gap-2 border-2 font-semibold">
                ⬇️ Download SVG
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
