import React from 'react';

function Footer({onReset}) {
    return (
        <div className="footer">
            <button onClick={onReset}>Reset</button>
        </div>
    );
}

export default Footer;
