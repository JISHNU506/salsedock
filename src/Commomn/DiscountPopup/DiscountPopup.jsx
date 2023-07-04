import React from "react";
import "./discountpopup.css";
import { InputLabel, MenuItem, Select, TextField } from "@mui/material";

function DiscountPopup({
  description,
  handleDurationChange,
  editMode,
  discountedPrice,
  selectedOption,
  duration,
  selectedDiscountForEdit,
  inputValue,
  discountName,
  inputType,
  handleInputChange,
  handleDropdownChange,
  generatePriceOption,
  handleDiscountNameChange
}) {
  return (
    <div className="discount_wrapper">
      <div className="heading">
        {editMode ? selectedDiscountForEdit?.name : "Discount Information"}
      </div>
      <div className="price_heading">
        For which price do you calculate the discount?
      </div>
      <div className="price_options">
        {generatePriceOption("one-time", "One time price")}
        {generatePriceOption("monthly", "Monthly price")}
      </div>

      {(selectedOption === "one-time" || selectedOption === "monthly") && (
        <div className="discount_textfield">
          <div className="textfield_wrapper">
            <InputLabel id="input-type-label">Discount</InputLabel>
            <Select
              labelId="input-type-label"
              id="input-type"
              value={inputType}
              onChange={handleDropdownChange}
              className="dropdown"
            >
              <MenuItem value="euro">€</MenuItem>
              <MenuItem value="percentage">%</MenuItem>
            </Select>
            <TextField
              type="number"
              id="discountField"
              value={inputValue}
              onChange={handleInputChange}
              className="input_field"
              variant="outlined"
              inputProps={{
                min: "0",
                max: inputType === "percentage" ? "100" : "100000",
              }}
            />
            {selectedOption === "monthly" && (
              <div className="textfield_wrapper">
                <InputLabel id="duration-label">Duration</InputLabel>
                <TextField
                  type="number"
                  id="durationField"
                  value={duration}
                  className="cost_field"
                  variant="outlined"
                  onChange={handleDurationChange}
                />
              </div>
            )}

            <div className="textfield_wrapper">
              <InputLabel id="new-price-label">New Price</InputLabel>
              <TextField
                type="text"
                id="newPriceField"
                value={discountedPrice}
                className="cost_field"
                variant="outlined"
                InputProps={{ readOnly: true }}
              />
            </div>
              <div className="textfield_wrapper">
                <InputLabel id="discount-name-label">Discount Name</InputLabel>
                <TextField
                  type="text"
                  id="discountNameField"
                  value={discountName}
                  onChange={handleDiscountNameChange}
                  className="cost_field"
                  variant="outlined"
                />
              </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DiscountPopup;
