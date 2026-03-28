import { useEffect, useRef } from 'react';

function HexGridBackground() {
  const canvasRef = useRef(null);
  const animationRef = useRef();
  const offsetRef = useRef({ x: 0, y: 0 });
  const hoveredCellRef = useRef(null);
  const pointerRef = useRef(null);
  const hoverVisibilityRef = useRef(0);
  const lastPointerMoveAtRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const size = 18;
    const speed = 0.42;
    const hexHorizontalStep = size * 1.5;
    const hexVerticalStep = size * Math.sqrt(3);
    const idleDelay = 500;
    const blockHoverSelector = [
      '.hero-card-inner',
      '.info-item',
      '.stat-card',
      '.pillar-card',
      '.project-card',
      '.stack-card',
      '.photo-placeholder',
      '.future-panel',
      '.future-lead',
      '.contact-card',
      '.contact-social-card',
      '.linkedin-qr-frame',
    ].join(', ');

    const isBlockedHoverTarget = (eventTarget) => {
      if (eventTarget instanceof Element && eventTarget.closest(blockHoverSelector)) {
        return true;
      }

      if (eventTarget instanceof Node && eventTarget.parentElement?.closest(blockHoverSelector)) {
        return true;
      }

      return false;
    };

    const getThemeColors = () => {
      const styles = window.getComputedStyle(document.body);
      const theme = document.body.dataset.theme || 'green';

      return {
        borderColor: theme === 'blue' ? '#1a315b' : '#163020',
        hoverFillColor: theme === 'blue' ? '#2f4d86' : '#35684a',
        hoverCoreFillColor: theme === 'blue' ? '#3b5f9f' : '#427b56',
        hoverStrokeColor: styles.getPropertyValue('--accent').trim() || '#8fe1aa',
      };
    };

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const drawHexagon = (centerX, centerY, radius) => {
      context.beginPath();
      for (let index = 0; index < 6; index += 1) {
        const angle = (Math.PI / 3) * index;
        const pointX = centerX + radius * Math.cos(angle);
        const pointY = centerY + radius * Math.sin(angle);
        if (index === 0) {
          context.moveTo(pointX, pointY);
        } else {
          context.lineTo(pointX, pointY);
        }
      }
      context.closePath();
    };

    const getNeighborCells = (cell, columnOffset) => {
      const isOddColumn = (cell.x + columnOffset) % 2 !== 0;

      return isOddColumn
        ? [
            { x: cell.x, y: cell.y - 1 },
            { x: cell.x, y: cell.y + 1 },
            { x: cell.x - 1, y: cell.y },
            { x: cell.x - 1, y: cell.y + 1 },
            { x: cell.x + 1, y: cell.y },
            { x: cell.x + 1, y: cell.y + 1 },
          ]
        : [
            { x: cell.x, y: cell.y - 1 },
            { x: cell.x, y: cell.y + 1 },
            { x: cell.x - 1, y: cell.y - 1 },
            { x: cell.x - 1, y: cell.y },
            { x: cell.x + 1, y: cell.y - 1 },
            { x: cell.x + 1, y: cell.y },
          ];
    };

    const render = () => {
      const { borderColor, hoverFillColor, hoverCoreFillColor, hoverStrokeColor } = getThemeColors();
      context.clearRect(0, 0, canvas.width, canvas.height);

      const offsetColumn = Math.floor(offsetRef.current.x / hexHorizontalStep);
      const offsetX = ((offsetRef.current.x % hexHorizontalStep) + hexHorizontalStep) % hexHorizontalStep;
      const offsetY = ((offsetRef.current.y % hexVerticalStep) + hexVerticalStep) % hexVerticalStep;
      const totalColumns = Math.ceil(canvas.width / hexHorizontalStep) + 3;
      const totalRows = Math.ceil(canvas.height / hexVerticalStep) + 3;
      const highlightedCells = new Set();
      const coreCellKey = hoveredCellRef.current
        ? `${hoveredCellRef.current.x},${hoveredCellRef.current.y}`
        : null;

      if (hoveredCellRef.current && hoverVisibilityRef.current > 0.01) {
        highlightedCells.add(coreCellKey);

        getNeighborCells(hoveredCellRef.current, offsetColumn).forEach((neighborCell) => {
          highlightedCells.add(`${neighborCell.x},${neighborCell.y}`);
        });
      }

      for (let column = -2; column < totalColumns; column += 1) {
        for (let row = -2; row < totalRows; row += 1) {
          const x = column * hexHorizontalStep + offsetX;
          const y =
            row * hexVerticalStep +
            (((column + offsetColumn) % 2 !== 0) ? hexVerticalStep / 2 : 0) +
            offsetY;

          const cellKey = `${column},${row}`;
          const isHovered = highlightedCells.has(cellKey);

          if (isHovered) {
            drawHexagon(x, y, size);
            context.globalAlpha =
              hoverVisibilityRef.current * (coreCellKey === cellKey ? 1 : 0.82);
            context.fillStyle = coreCellKey === cellKey ? hoverCoreFillColor : hoverFillColor;
            context.fill();

            context.strokeStyle = hoverStrokeColor;
            context.lineWidth = 1.15;
            context.stroke();
            context.globalAlpha = 1;
          }

          drawHexagon(x, y, size);
          context.strokeStyle = borderColor;
          context.lineWidth = 1;
          context.stroke();
        }
      }

      const vignette = context.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.sqrt(canvas.width ** 2 + canvas.height ** 2) / 2,
      );

      vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignette.addColorStop(1, 'rgba(0, 0, 0, 0.28)');
      context.fillStyle = vignette;
      context.fillRect(0, 0, canvas.width, canvas.height);
    };

    const animate = () => {
      const movementSpeed = Math.max(speed, 0.1);
      offsetRef.current.x = (offsetRef.current.x - movementSpeed + hexHorizontalStep * 2) % (hexHorizontalStep * 2);
      offsetRef.current.y =
        (offsetRef.current.y - movementSpeed * 0.58 + hexVerticalStep * 2) % (hexVerticalStep * 2);

      const now = Date.now();
      const shouldShowHover =
        pointerRef.current && now - lastPointerMoveAtRef.current < idleDelay;
      const targetVisibility = shouldShowHover ? 1 : 0;
      const easing = shouldShowHover ? 0.12 : 0.08;
      hoverVisibilityRef.current +=
        (targetVisibility - hoverVisibilityRef.current) * easing;

      if (pointerRef.current) {
        setHoveredCellFromPoint(pointerRef.current.x, pointerRef.current.y);
      }
      render();
      animationRef.current = window.requestAnimationFrame(animate);
    };

    const setHoveredCellFromPoint = (clientX, clientY) => {
      const bounds = canvas.getBoundingClientRect();
      const x = clientX - bounds.left;
      const y = clientY - bounds.top;

      const columnOffset = Math.floor(offsetRef.current.x / hexHorizontalStep);
      const shiftedX = x - (((offsetRef.current.x % hexHorizontalStep) + hexHorizontalStep) % hexHorizontalStep);
      const shiftedY = y - (((offsetRef.current.y % hexVerticalStep) + hexVerticalStep) % hexVerticalStep);

      const column = Math.round(shiftedX / hexHorizontalStep);
      const rowOffset = (column + columnOffset) % 2 !== 0 ? hexVerticalStep / 2 : 0;
      const row = Math.round((shiftedY - rowOffset) / hexVerticalStep);

      if (!hoveredCellRef.current || hoveredCellRef.current.x !== column || hoveredCellRef.current.y !== row) {
        hoveredCellRef.current = { x: column, y: row };
      }
    };

    const handleWindowMouseMove = (event) => {
      if (isBlockedHoverTarget(event.target)) {
        pointerRef.current = null;
        hoveredCellRef.current = null;
        return;
      }

      pointerRef.current = { x: event.clientX, y: event.clientY };
      lastPointerMoveAtRef.current = Date.now();
      setHoveredCellFromPoint(event.clientX, event.clientY);
    };

    const handleMouseLeave = () => {
      pointerRef.current = null;
      lastPointerMoveAtRef.current = 0;
      hoveredCellRef.current = null;
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    resizeCanvas();
    animationRef.current = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="shape-grid-background" aria-hidden="true">
      <canvas ref={canvasRef} className="shapegrid-canvas hex-shapegrid-canvas" />
    </div>
  );
}

export default HexGridBackground;
