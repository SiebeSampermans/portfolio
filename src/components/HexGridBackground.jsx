import { useEffect, useRef } from 'react';

function HexGridBackground() {
  const canvasRef = useRef(null);
  const animationRef = useRef();
  const offsetRef = useRef({ x: 0, y: 0 });
  const hoveredCellRef = useRef(null);
  const fillMapRef = useRef(new Map());

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const size = 18;
    const speed = 0.38;
    const borderColor = '#163020';
    const hoverFillColor = '#4c9a69';
    const hoverStrokeColor = '#8fe1aa';
    const hexHorizontalStep = size * 1.5;
    const hexVerticalStep = size * Math.sqrt(3);
    const desktopMinWidth = 1280;

    const getContainerWidth = () => Math.min(1140, window.innerWidth - 32);

    const isInDesktopSideZone = (clientX) => {
      if (window.innerWidth < desktopMinWidth) {
        return false;
      }

      const sideGap = Math.max((window.innerWidth - getContainerWidth()) / 2, 0);
      return clientX <= sideGap || clientX >= window.innerWidth - sideGap;
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

    const updateFillMap = () => {
      const nextFillMap = new Map();
      const columnOffset = Math.floor(offsetRef.current.x / hexHorizontalStep);

      if (hoveredCellRef.current) {
        nextFillMap.set(`${hoveredCellRef.current.x},${hoveredCellRef.current.y}`, {
          intensity: 1,
          type: 'core',
        });

        getNeighborCells(hoveredCellRef.current, columnOffset).forEach((neighborCell) => {
          const neighborKey = `${neighborCell.x},${neighborCell.y}`;
          if (!nextFillMap.has(neighborKey)) {
            nextFillMap.set(neighborKey, {
              intensity: 0.46,
              type: 'neighbor',
            });
          }
        });
      }

      for (const [key] of nextFillMap) {
        if (!fillMapRef.current.has(key)) {
          fillMapRef.current.set(key, {
            intensity: 0,
            type: nextFillMap.get(key)?.type || 'core',
          });
        }
      }

      for (const [key, value] of fillMapRef.current) {
        const targetEntry = nextFillMap.get(key);
        const targetValue = targetEntry ? targetEntry.intensity : 0;
        const easedValue = value.intensity + (targetValue - value.intensity) * 0.1;

        if (easedValue < 0.005) {
          fillMapRef.current.delete(key);
        } else {
          fillMapRef.current.set(key, {
            intensity: easedValue,
            type: targetEntry?.type || value.type || 'core',
          });
        }
      }
    };

    const render = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      const offsetColumn = Math.floor(offsetRef.current.x / hexHorizontalStep);
      const offsetX = ((offsetRef.current.x % hexHorizontalStep) + hexHorizontalStep) % hexHorizontalStep;
      const offsetY = ((offsetRef.current.y % hexVerticalStep) + hexVerticalStep) % hexVerticalStep;
      const totalColumns = Math.ceil(canvas.width / hexHorizontalStep) + 3;
      const totalRows = Math.ceil(canvas.height / hexVerticalStep) + 3;

      for (let column = -2; column < totalColumns; column += 1) {
        for (let row = -2; row < totalRows; row += 1) {
          const x = column * hexHorizontalStep + offsetX;
          const y =
            row * hexVerticalStep +
            (((column + offsetColumn) % 2 !== 0) ? hexVerticalStep / 2 : 0) +
            offsetY;

          const key = `${column},${row}`;
          const fillEntry = fillMapRef.current.get(key);

          if (fillEntry) {
            context.globalAlpha = fillEntry.intensity;
            drawHexagon(x, y, size);
            context.fillStyle = hoverFillColor;
            context.fill();

            context.strokeStyle = hoverStrokeColor;
            context.lineWidth = 1.25;
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
      updateFillMap();
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

    const handleMouseMove = (event) => {
      setHoveredCellFromPoint(event.clientX, event.clientY);
    };

    const handleWindowMouseMove = (event) => {
      if (isInDesktopSideZone(event.clientX)) {
        setHoveredCellFromPoint(event.clientX, event.clientY);
      } else if (event.target !== canvas) {
        hoveredCellRef.current = null;
      }
    };

    const handleMouseLeave = () => {
      hoveredCellRef.current = null;
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleWindowMouseMove);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    resizeCanvas();
    animationRef.current = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleWindowMouseMove);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
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
