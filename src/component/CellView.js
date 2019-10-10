import React from 'react';

function CellView({ value, isDefault=false, isCustomisable=false, changeValueCallback, ...props }) {
    const changeValue = () => {
        changeValueCallback( (value + 1) % 10);
    };

    return (
        <span className="CellView"
              onClick={isCustomisable ? changeValue : null}
              custom-isdefault={isDefault.toString()}
              custom-iscustomisable={isCustomisable.toString()}
              {...props}>
            { 1 <= value && value <= 9 ? value : "_"}
        </span>
    );
}

export default CellView;
