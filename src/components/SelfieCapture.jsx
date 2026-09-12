import { useEffect, useRef, useState } from 'react';
import { Camera, X, RefreshCw, Loader2, AlertTriangle } from 'lucide-react';

/**
 * Selfie capture. Opens the device camera, shows a live preview, and returns
 * a JPEG blob + data URL when the guest taps the shutter.
 *
 * Front camera by default, with a flip button for devices that have both.
 * The video is mirrored on screen (people expect that) but the captured
 * frame is NOT mirrored — face matching should see the real orientation.
 */
export default function SelfieCapture({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [facing, setFacing] = useState('user');
  const [error, setError] = useState('');
  const [starting, setStarting] = useState(true);
  const [shot, setShot] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const start = async () => {
      setStarting(true);
      setError('');
      try {
        streamRef.current?.getTracks().forEach((t) => t.stop());
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 1280 } },
          audio: false,
        });
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
      } catch (err) {
        if (err?.name === 'NotAllowedError') {
          setError('Camera permission was blocked. Allow camera access in your browser settings and try again.');
        } else if (err?.name === 'NotFoundError') {
          setError('No camera found on this device.');
        } else if (!window.isSecureContext) {
          setError('The camera only works over a secure (https) connection.');
        } else {
          setError('Could not open the camera. Try another browser.');
        }
      } finally {
        if (!cancelled) setStarting(false);
      }
    };

    start();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [facing]);

  const capture = () => {
    const video = videoRef.current;
    if (!video?.videoWidth) return;
    const size = Math.min(video.videoWidth, video.videoHeight);
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      video,
      (video.videoWidth - size) / 2,
      (video.videoHeight - size) / 2,
      size, size, 0, 0, size, size
    );
    canvas.toBlob((blob) => {
      setShot({ blob, url: canvas.toDataURL('image/jpeg', 0.9) });
    }, 'image/jpeg', 0.9);
  };

  return (
    <div className="fixed inset-0 z-50 bg-foreground flex flex-col">
      <div className="flex items-center justify-between p-4 text-background">
        <span className="text-sm font-medium">{shot ? 'Looks good?' : 'Take a selfie'}</span>
        <button onClick={onClose} className="p-2 rounded-full bg-background/15 hover:bg-background/25 transition" aria-label="Close">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-2 min-h-0">
        {error ? (
          <div className="text-center text-background max-w-xs">
            <AlertTriangle className="w-10 h-10 mx-auto mb-3 opacity-70" />
            <p className="text-sm leading-relaxed opacity-90">{error}</p>
            <button onClick={onClose} className="mt-5 px-5 py-2.5 rounded-full bg-background text-foreground text-sm font-semibold">
              Close
            </button>
          </div>
        ) : shot ? (
          <img src={shot.url} alt="" className="max-w-full max-h-full rounded-2xl object-contain" />
        ) : (
          <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden bg-black">
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: facing === 'user' ? 'scaleX(-1)' : 'none' }}
            />
            {starting && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-7 h-7 animate-spin text-background/80" />
              </div>
            )}
            <div className="absolute inset-8 rounded-full border-2 border-background/40 pointer-events-none" />
          </div>
        )}
      </div>

      {!error && (
        <div className="p-6 flex items-center justify-center gap-6">
          {shot ? (
            <>
              <button
                onClick={() => setShot(null)}
                className="px-5 py-3 rounded-full bg-background/15 text-background text-sm font-medium"
              >
                Retake
              </button>
              <button
                onClick={() => onCapture(shot)}
                className="px-7 py-3.5 rounded-full bg-accent text-accent-foreground font-semibold"
              >
                Use this photo
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setFacing((f) => (f === 'user' ? 'environment' : 'user'))}
                className="p-3 rounded-full bg-background/15 text-background"
                aria-label="Flip camera"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={capture}
                disabled={starting}
                className="w-18 h-18 p-1 rounded-full bg-background disabled:opacity-40"
                aria-label="Take photo"
                style={{ width: 72, height: 72 }}
              >
                <span className="block w-full h-full rounded-full border-4 border-foreground/20 flex items-center justify-center">
                  <Camera className="w-6 h-6 text-foreground" />
                </span>
              </button>
              <div style={{ width: 44 }} />
            </>
          )}
        </div>
      )}
    </div>
  );
}
