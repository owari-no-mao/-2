import React, { useRef, useEffect } from 'react';
import { Agent, StageId } from '../types/simulation';

interface WorldCanvasProps {
  agents: Agent[];
  stage: StageId;
  fireIntensity: number;
  season: '春' | '夏' | '秋' | '冬';
  selectedAgentId: string | null;
  onSelectAgent: (agent: Agent | null) => void;
}

export const WorldCanvas: React.FC<WorldCanvasProps> = ({
  agents,
  stage,
  fireIntensity,
  season,
  selectedAgentId,
  onSelectAgent,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let tick = 0;

    const render = () => {
      tick += 1;
      const width = canvas.width;
      const height = canvas.height;

      // 1. Background based on season & time
      let bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (season === '春') {
        bgGrad.addColorStop(0, '#132e27');
        bgGrad.addColorStop(0.5, '#1e3f34');
        bgGrad.addColorStop(1, '#1b342b');
      } else if (season === '夏') {
        bgGrad.addColorStop(0, '#1c3321');
        bgGrad.addColorStop(0.5, '#294d30');
        bgGrad.addColorStop(1, '#203926');
      } else if (season === '秋') {
        bgGrad.addColorStop(0, '#362b1a');
        bgGrad.addColorStop(0.5, '#4a3b22');
        bgGrad.addColorStop(1, '#332717');
      } else {
        // 冬
        bgGrad.addColorStop(0, '#192633');
        bgGrad.addColorStop(0.5, '#223547');
        bgGrad.addColorStop(1, '#1c2937');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle terrain ground textures
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
      for (let i = 0; i < 12; i++) {
        const x = (i * 73 + tick * 0.05) % width;
        const y = 80 + (i * 29) % (height - 140);
        ctx.beginPath();
        ctx.ellipse(x, y, 40 + (i % 3) * 20, 15, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // River / Water Stream in the lower section
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, height * 0.85);
      ctx.bezierCurveTo(width * 0.3, height * 0.78, width * 0.6, height * 0.95, width, height * 0.82);
      ctx.stroke();

      // Cave / Shelter in background if settlement/myth
      if (stage === 'settlement' || stage === 'law') {
        // Huts / Shelters
        ctx.fillStyle = '#452c1e';
        ctx.beginPath();
        ctx.moveTo(140, 160);
        ctx.lineTo(190, 100);
        ctx.lineTo(240, 160);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#633e2b';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(560, 150);
        ctx.lineTo(610, 95);
        ctx.lineTo(660, 150);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      // Stone Tablet / Monument if Law stage
      if (stage === 'law') {
        ctx.fillStyle = '#64748b';
        ctx.fillRect(480, 170, 36, 50);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px monospace';
        ctx.fillText('≡ ≡', 488, 190);
        ctx.fillText('≡ ≡', 488, 204);
      }

      // Central "Tree of Knowledge" (知恵の樹)
      const treeX = 400;
      const treeY = 220;

      // Tree Trunk
      ctx.fillStyle = '#3d2618';
      ctx.beginPath();
      ctx.moveTo(treeX - 18, treeY + 70);
      ctx.quadraticCurveTo(treeX - 8, treeY + 10, treeX - 12, treeY - 20);
      ctx.lineTo(treeX + 12, treeY - 20);
      ctx.quadraticCurveTo(treeX + 8, treeY + 10, treeX + 18, treeY + 70);
      ctx.closePath();
      ctx.fill();

      // Tree Foliage with subtle pulsing wisdom glow
      const wisdomGlow = 0.4 + Math.sin(tick * 0.04) * 0.15;
      const foliageGrad = ctx.createRadialGradient(treeX, treeY - 50, 10, treeX, treeY - 50, 95);
      foliageGrad.addColorStop(0, stage === 'law' ? '#d97706' : '#22c55e');
      foliageGrad.addColorStop(0.7, stage === 'law' ? '#92400e' : '#15803d');
      foliageGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');

      ctx.save();
      ctx.shadowColor = stage === 'law' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(34, 197, 94, 0.3)';
      ctx.shadowBlur = 25 * wisdomGlow;
      ctx.fillStyle = foliageGrad;
      ctx.beginPath();
      ctx.arc(treeX, treeY - 45, 75, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Golden Fruits of Wisdom on tree
      const fruitCount = stage === 'law' ? 8 : stage === 'settlement' ? 6 : stage === 'myth' ? 4 : 2;
      for (let f = 0; f < fruitCount; f++) {
        const fAngle = (f * Math.PI * 2) / fruitCount + 0.3;
        const fx = treeX + Math.cos(fAngle) * 45;
        const fy = treeY - 45 + Math.sin(fAngle) * 35;
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(fx, fy, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(fx - 1, fy - 1, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Central Hearth / Fire
      const fireX = 390;
      const fireY = 290;

      // Stones around hearth
      ctx.fillStyle = '#475569';
      for (let s = 0; s < 7; s++) {
        const sAngle = (s * Math.PI * 2) / 7;
        const sx = fireX + Math.cos(sAngle) * 18;
        const sy = fireY + Math.sin(sAngle) * 10;
        ctx.beginPath();
        ctx.ellipse(sx, sy, 4.5, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Fire Flame animation if intensity > 0
      if (fireIntensity > 5) {
        const flameHeight = 12 + (fireIntensity / 100) * 22;
        const flameFlicker = Math.sin(tick * 0.3) * 3;

        // Fire light radius on ground
        const fireLight = ctx.createRadialGradient(fireX, fireY, 5, fireX, fireY, 80 + (fireIntensity / 100) * 70);
        fireLight.addColorStop(0, 'rgba(249, 115, 22, 0.45)');
        fireLight.addColorStop(0.5, 'rgba(234, 88, 12, 0.15)');
        fireLight.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = fireLight;
        ctx.beginPath();
        ctx.ellipse(fireX, fireY, 110, 65, 0, 0, Math.PI * 2);
        ctx.fill();

        // Inner flame
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(fireX - 8, fireY + 4);
        ctx.quadraticCurveTo(fireX + flameFlicker, fireY - flameHeight, fireX, fireY - flameHeight);
        ctx.quadraticCurveTo(fireX + 8, fireY + 4, fireX + 8, fireY + 4);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.moveTo(fireX - 5, fireY + 2);
        ctx.quadraticCurveTo(fireX - flameFlicker, fireY - flameHeight * 0.65, fireX, fireY - flameHeight * 0.7);
        ctx.quadraticCurveTo(fireX + 5, fireY + 2, fireX + 5, fireY + 2);
        ctx.closePath();
        ctx.fill();
      }

      // 2. Render Agents
      // Sort agents by Y coordinate for proper depth layering
      const sortedAgents = [...agents].sort((a, b) => a.y - b.y);

      for (const agent of sortedAgents) {
        const isSelected = agent.id === selectedAgentId;

        // Shadow beneath agent
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.beginPath();
        ctx.ellipse(agent.x, agent.y + 4, 7, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Selection ring
        if (isSelected) {
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(agent.x, agent.y + 4, 13, 6, 0, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Agent Body
        // Body color depends on role
        let bodyColor = '#d97706'; // explorer
        if (agent.role === 'forager') bodyColor = '#10b981';
        else if (agent.role === 'firekeeper') bodyColor = '#f97316';
        else if (agent.role === 'crafter') bodyColor = '#8b5cf6';
        else if (agent.role === 'elder') bodyColor = '#e2e8f0';

        // Head
        ctx.fillStyle = agent.gender === 'male' ? '#b45309' : '#c2410c';
        ctx.beginPath();
        ctx.arc(agent.x, agent.y - 12, 5, 0, Math.PI * 2);
        ctx.fill();

        // Torso / Fur Clothing
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.roundRect(agent.x - 5, agent.y - 7, 10, 11, [3]);
        ctx.fill();

        // Limbs / Walking animation
        const walkCycle = Math.sin(tick * 0.2 + agent.x);
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 1.5;
        // Legs
        ctx.beginPath();
        ctx.moveTo(agent.x - 3, agent.y + 4);
        ctx.lineTo(agent.x - 3 + walkCycle * 2, agent.y + 9);
        ctx.moveTo(agent.x + 3, agent.y + 4);
        ctx.lineTo(agent.x + 3 - walkCycle * 2, agent.y + 9);
        ctx.stroke();

        // Name tag (unboxed subtle text)
        ctx.fillStyle = isSelected ? '#fbbf24' : '#cbd5e1';
        ctx.font = isSelected ? 'bold 10px sans-serif' : '9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(agent.name, agent.x, agent.y - 19);

        // Speech bubble
        if (agent.speechBubble) {
          const bubbleW = 60;
          const bubbleH = 20;
          const bx = agent.x;
          const by = agent.y - 38;

          ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
          ctx.strokeStyle = '#e2e8f0';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(bx - bubbleW / 2, by - bubbleH / 2, bubbleW, bubbleH, [6]);
          ctx.fill();
          ctx.stroke();

          // Bubble tail
          ctx.beginPath();
          ctx.moveTo(bx - 3, by + bubbleH / 2);
          ctx.lineTo(bx, by + bubbleH / 2 + 4);
          ctx.lineTo(bx + 3, by + bubbleH / 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.font = '10px sans-serif';
          ctx.fillText(`${agent.speechBubble.icon} ${agent.speechBubble.text}`, bx, by + 3);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [agents, stage, fireIntensity, season, selectedAgentId]);

  // Click on canvas to select agent
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    // Find closest agent within 24px
    let found: Agent | null = null;
    let minDist = 24;

    for (const a of agents) {
      const dist = Math.hypot(a.x - clickX, a.y - clickY);
      if (dist < minDist) {
        minDist = dist;
        found = a;
      }
    }

    onSelectAgent(found);
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-700/60 shadow-xl bg-slate-950">
      <canvas
        ref={canvasRef}
        width={800}
        height={480}
        onClick={handleCanvasClick}
        className="w-full h-auto aspect-[5/3] block cursor-pointer select-none"
      />
      <div className="absolute top-3 left-3 pointer-events-none flex items-center gap-2 text-xs text-slate-300 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/50">
        <span>知恵の樹とサバンナ</span>
        <span aria-hidden="true">·</span>
        <span className="tabular-nums">個体数 {agents.length}名</span>
        <span aria-hidden="true">·</span>
        <span>人をクリックで詳細表示</span>
      </div>
      <div className="absolute bottom-3 right-3 pointer-events-none flex items-center gap-3 text-xs text-slate-300 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/50">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span> 採集
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span> 探索
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-orange-400"></span> 火守
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-slate-200"></span> 長老
        </span>
      </div>
    </div>
  );
};
