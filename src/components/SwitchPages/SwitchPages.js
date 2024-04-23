import React, { useState } from "react";
import Switch from "react-switch";
import { FaGreaterThan, FaLessThan } from "react-icons/fa";

const SwitchPages = ({ switchedOn, text1, text2, comp1, comp2 }) => {
  const [checked, setChecked] = useState(true);

  return (
    <div className="component">
      {!switchedOn ? (
        <div className="display-component">
          <h1>Please Turn on Back End!</h1>
        </div>
      ) : (
        <div>
          <div className="display-component">
            <div className="switch">
              <h1>{text1}</h1>
              <Switch
                offColor="#9BCA31"
                onColor="#E3E545"
                uncheckedIcon={<FaLessThan />}
                checkedIcon={<FaGreaterThan />}
                className="switch-toggle"
                checked={checked}
                onChange={() => {
                  setChecked(!checked);
                }}
              />
              <h1>{text2}</h1>
            </div>
          </div>
          {checked === false ? comp1 : comp2}
        </div>
      )}
    </div>
  );
};

export default SwitchPages;
