import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  Camera,
  Sun,
  User,
  Maximize2,
  AlertTriangle,
  Eye,
  Smile,
  Clock,
} from "lucide-react";

interface CameraGuidelinesProps {
  type: "profile" | "aadhaar";
}

export function CameraGuidelines({ type }: CameraGuidelinesProps) {
  const profileGuidelines = [
    {
      icon: <User className="h-4 w-4 text-green-600" />,
      title: "Face Position & Distance",
      description:
        "Keep your face centered, 12-18 inches from camera. Fill 60-70% of the frame with your face.",
      details: [
        "Face should be straight, not tilted",
        "Both ears should be visible",
        "Maintain eye level with camera",
      ],
    },
    {
      icon: <Eye className="h-4 w-4 text-green-600" />,
      title: "Eye Contact & Expression",
      description:
        "Look directly at the camera with eyes open and a neutral expression.",
      details: [
        "No sunglasses or tinted glasses",
        "Remove caps or hats",
        "Keep mouth closed, slight smile is okay",
      ],
    },
    {
      icon: <Sun className="h-4 w-4 text-green-600" />,
      title: "Lighting Requirements",
      description:
        "Ensure even, bright lighting on your face without harsh shadows.",
      details: [
        "Use natural daylight when possible",
        "Avoid backlighting (light behind you)",
        "No direct flash or harsh artificial light",
      ],
    },
    {
      icon: <Maximize2 className="h-4 w-4 text-green-600" />,
      title: "Background & Environment",
      description:
        "Use a plain, light-colored background with minimal distractions.",
      details: [
        "White, light gray, or cream background preferred",
        "No patterns, textures, or busy backgrounds",
        "Ensure good contrast between face and background",
      ],
    },
    {
      icon: <Camera className="h-4 w-4 text-green-600" />,
      title: "Camera Quality & Focus",
      description: "Ensure camera is stable and image is sharp and clear.",
      details: [
        "Hold device steady or use a stand",
        "Wait for camera to focus before capturing",
        "Minimum 2MP camera resolution recommended",
      ],
    },
    {
      icon: <Clock className="h-4 w-4 text-green-600" />,
      title: "Liveness Detection",
      description: "Be prepared for liveness checks during capture.",
      details: [
        "You may be asked to blink or turn head slightly",
        "Stay still during capture process",
        "Follow on-screen instructions promptly",
      ],
    },
  ];

  const aadhaarGuidelines = [
    {
      icon: <CheckCircle className="h-4 w-4 text-green-600" />,
      title: "Card Visibility",
      description: "Ensure the entire Aadhaar card is visible within the frame",
      details: [
        "All four corners of the card should be visible",
        "Card should fill 80-90% of the frame",
        "No parts of the card should be cut off",
      ],
    },
    {
      icon: <Sun className="h-4 w-4 text-green-600" />,
      title: "Text Clarity",
      description:
        "All text should be clearly readable without blur or shadows",
      details: [
        "Focus on the text areas",
        "Ensure no motion blur",
        "All numbers and letters should be sharp",
      ],
    },
    {
      icon: <Maximize2 className="h-4 w-4 text-green-600" />,
      title: "Surface & Positioning",
      description:
        "Place the card on a flat, contrasting surface for better visibility",
      details: [
        "Use a dark surface for better contrast",
        "Keep card completely flat",
        "Avoid curved or uneven surfaces",
      ],
    },
    {
      icon: <Camera className="h-4 w-4 text-green-600" />,
      title: "Lighting & Glare",
      description: "Avoid reflections or glare on the card surface",
      details: [
        "Use diffused lighting",
        "Avoid direct overhead lights",
        "Tilt card slightly if there's glare",
      ],
    },
  ];

  const guidelines = type === "profile" ? profileGuidelines : aadhaarGuidelines;

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          {type === "profile"
            ? "Live Photo Capture Guidelines"
            : "Aadhaar Card Photo Guidelines"}
        </CardTitle>
        <CardDescription>
          {type === "profile"
            ? "Follow these guidelines for optimal face recognition and liveness detection"
            : "Follow these guidelines for best text extraction results"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-4">
          {guidelines.map((guideline, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-start gap-3 mb-2">
                {guideline.icon}
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{guideline.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {guideline.description}
                  </p>
                </div>
              </div>
              <ul className="ml-7 space-y-1">
                {guideline.details.map((detail, detailIndex) => (
                  <li
                    key={detailIndex}
                    className="text-xs text-muted-foreground flex items-start gap-1"
                  >
                    <span className="text-green-600 mt-0.5">•</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {type === "profile" && (
          <div className="space-y-3">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Liveness Detection:</strong> Our AI system will verify
                that you're a real person. Be prepared to follow simple
                instructions like blinking or slight head movements during
                capture.
              </AlertDescription>
            </Alert>

            <Alert className="border-blue-200 bg-blue-50">
              <Eye className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Quality Requirements:</strong> Your photo must be clear
                enough for facial recognition. Poor lighting or blurry images
                will be rejected automatically.
              </AlertDescription>
            </Alert>

            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Smile className="h-4 w-4 text-green-600" />
                Quick Checklist Before Capture:
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" disabled />
                  <span>Face is well-lit and clearly visible</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" disabled />
                  <span>Plain background behind you</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" disabled />
                  <span>Looking directly at camera</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" disabled />
                  <span>No glasses, hats, or obstructions</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" disabled />
                  <span>Camera is stable and focused</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" disabled />
                  <span>Good internet connection</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {type === "aadhaar" && (
          <div className="space-y-3">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>AI Text Extraction:</strong> Our system will
                automatically extract all text from your Aadhaar card. Ensure
                all details are clearly visible for accurate processing.
              </AlertDescription>
            </Alert>

            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Aadhaar Capture Checklist:
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" disabled />
                  <span>All text is clearly readable</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" disabled />
                  <span>No glare or reflections</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" disabled />
                  <span>Card is completely flat</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" disabled />
                  <span>All corners are visible</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" disabled />
                  <span>Photo on card is clear</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" disabled />
                  <span>Good contrast with background</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
