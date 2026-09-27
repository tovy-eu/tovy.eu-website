"use client";

import dynamic from "next/dynamic";

const AeroShards = dynamic(() => import("@/components/AeroShards"), { ssr: false });

/**
 * Minimalistic AeroShards background for content pages (404, legal, payment-success).
 * Calm and non-interactive so it never competes with the page content.
 * Intentionally NOT used on the project intake form.
 */
export function AeroShardsBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
      <AeroShards
        backgroundColor="#070D1D"
        shardColor="#5966FF"
        accentColor="#A966FF"
        placement="full"
        material="satin"
        flow="stream"
        effect="none"
        interaction="none"
        density={0.6}
        shardSize={1.1}
        speed={0.4}
        spin={0.4}
        turbulence={0.25}
        glow={0.5}
        bloom={0.3}
        grain={0.03}
        chromaticAberration={0}
        rippleIntensity={0}
        holdToGather={false}
        paused={false}
        onError={console.error}
      />
    </div>
  );
}
