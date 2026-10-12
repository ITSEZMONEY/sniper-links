import { useEffect, useRef } from 'react';
import { SniperLinkWidget } from '@/widget/widget';
import type { SniperLinkConfig } from '@/lib/sniper-link';

export default function WidgetPreview({ email, config }: { email: string; config: SniperLinkConfig }) {
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!container.current) return;
    const widget = new SniperLinkWidget({ ...config, email, container: container.current });
    widget.init();
    return () => widget.destroy();
  }, [email, config]);
  return <div ref={container} data-testid="widget-preview" className="flex justify-center" />;
}
