import React from "react";
import Button from "@mui/material/Button";
import "./cart.css";
import warmtewinner from "../../assets/Images/warmtewinner-roze 1.svg";



function Cart({selectedDiscounts,finalDiscount,discountedPrice}) {
  return (
    <div className="cart_items">
            <div className="side_Cart">
              <div className="image-container">
                <img src={warmtewinner} alt="Product" className="img_prod" />
              </div>

              <div className="row cart_item">
                <h3>Overview</h3>
              </div>

              <div className="row">
                <div>Webasto Pure II laadpaal type 2</div>
                <div>€ 1.000,00</div>
              </div>

              <div className="row">
                <div className="left type_discount">Maandelijkse prijs</div>
                <div className="right">€ 10,00</div>
              </div>
              <Button variant="outlined" className="addDiscountButton">
                Edit
              </Button>
            </div>

            <div className="row cart_val">
              <div className="left">Eventually per month excl. btw</div>
              <div className="right">€ 10,000</div>
            </div>

            <div className="sub_total">
              <div className="row">
                <div className="left">Subtotal onetime costs excl. btw</div>
                <div className="right">€ 1000,00</div>
              </div>
              <div className="row type_discount">
                {selectedDiscounts.length > 0
                  ? selectedDiscounts[0].name 
                  : "No discount applied"}
                <div className="right">
                  - € {discountedPrice ? discountedPrice : "0.00"}
                </div>
              </div>
              <div className="row cart">
                <div className="left">One time costs excl. btw</div>
                <div className="right">€ {finalDiscount}</div>
              </div>
            </div>
          </div>
  );
}

export default Cart;
