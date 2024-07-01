import React from 'react';

function Cell({data, onClick, onContextMenu}) {
    const handleClick = (event) => {
        // Logic to handle cell click (open cell)
    };

    const handleContextMenu = (event) => {
        event.preventDefault(); // Prevents the default context menu
        // Logic to handle right-click (flag cell)
    };

    // Class names for different states
    const cellClass = `cell ${data.isOpen ? "open" : ""} ${data.isFlagged ? "flagged" : ""} ${data.isOpen && data.isMine ? "mined" : ""}`;

    return (
        <div
            className={cellClass}
            onClick={onClick}
            onContextMenu={onContextMenu}>
            {data.isOpen && data.isMine && <span>💣</span>}
            {data.isOpen && !data.isMine && data.minesAround !== 0 && data.minesAround}
            {!data.isOpen && data.isFlagged && <span>🚩</span>}
        </div>
    );
}

export default Cell;
