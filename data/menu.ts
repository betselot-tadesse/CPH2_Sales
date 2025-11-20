import { MenuItem } from "../types";

export const MENU_CATEGORIES = [
  "STARTERS",
  "SOUP",
  "SALADS",
  "SANDWICHES",
  "Taste of India",
  "Arabian Taste",
  "Italian Taste",
  "DESSERT",
  "HOT BEVERAGE",
  "COLD BEVERAGE"
];

export const MENU_ITEMS: MenuItem[] = [
  // STARTERS
  { id: "st1", category: "STARTERS", name: "French Fries", price: 12, description: "Crispy golden potato fries", isVeg: true, isSpicy: false },
  { id: "st2", category: "STARTERS", name: "Vegetable Spring Rolls (6 Pcs)", price: 16, description: "Crispy rolls with vegetable filling", isVeg: true, isSpicy: false },
  { id: "st3", category: "STARTERS", name: "Meat Kibbeh (6 Pcs)", price: 16, description: "Fried bulgur wheat balls stuffed with minced meat", isVeg: false, isSpicy: false },
  { id: "st4", category: "STARTERS", name: "Cheese Rolls (6 Pcs)", price: 16, description: "Crispy rolls filled with cheese", isVeg: true, isSpicy: false },
  { id: "st5", category: "STARTERS", name: "Vegetable Samosa (6 Pcs)", price: 16, description: "Fried pastry with savory vegetable filling", isVeg: true, isSpicy: true },
  { id: "st6", category: "STARTERS", name: "BBQ Chicken Wings", price: 25, description: "Chicken wings tossed in BBQ sauce", isVeg: false, isSpicy: false },

  // SOUP
  { id: "sp1", category: "SOUP", name: "Lentil Soup", price: 15, description: "Traditional lentil soup", isVeg: true, isSpicy: false },
  { id: "sp2", category: "SOUP", name: "Vegetable Soup", price: 15, description: "Mixed vegetable soup", isVeg: true, isSpicy: false },
  { id: "sp3", category: "SOUP", name: "Chicken Soup", price: 15, description: "Clear soup with chicken pieces", isVeg: false, isSpicy: false },
  { id: "sp4", category: "SOUP", name: "Chicken Cream Soup", price: 15, description: "Creamy soup with chicken", isVeg: false, isSpicy: false },

  // SALADS
  { id: "sl1", category: "SALADS", name: "Quinoa Salad", price: 20, description: "Healthy quinoa with fresh vegetables", isVeg: true, isSpicy: false },
  { id: "sl2", category: "SALADS", name: "Fattoush Salad", price: 18, description: "Mixed greens with toasted bread and sumac", isVeg: true, isSpicy: false },
  { id: "sl3", category: "SALADS", name: "Caesar Salad", price: 18, description: "Romaine lettuce, parmesan cheese, croutons", isVeg: true, isSpicy: false },

  // SANDWICHES
  { id: "sw1", category: "SANDWICHES", name: "Beef Burger Platter", price: 23, description: "Juicy beef patty served with fries", isVeg: false, isSpicy: false },
  { id: "sw2", category: "SANDWICHES", name: "Chicken Burger Platter", price: 20, description: "Chicken patty served with fries", isVeg: false, isSpicy: false },
  { id: "sw3", category: "SANDWICHES", name: "Club Sandwich Platter", price: 23, description: "Triple decker sandwich served with fries", isVeg: false, isSpicy: false },
  { id: "sw4", category: "SANDWICHES", name: "Chicken Shawarma", price: 20, description: "Traditional chicken shawarma wrap", isVeg: false, isSpicy: false },
  { id: "sw5", category: "SANDWICHES", name: "Chicken Tikka", price: 20, description: "Spiced chicken tikka sandwich", isVeg: false, isSpicy: true },

  // Taste of India
  { id: "in1", category: "Taste of India", name: "Chicken Biryani", price: 30, description: "Aromatic basmati rice with spiced chicken", isVeg: false, isSpicy: true },
  { id: "in2", category: "Taste of India", name: "Vegetable Biryani", price: 25, description: "Aromatic basmati rice with mixed vegetables", isVeg: true, isSpicy: true },
  { id: "in3", category: "Taste of India", name: "Paneer Tikka Masala (Rice)", price: 20, description: "Cottage cheese in spiced gravy served with rice", isVeg: true, isSpicy: true },
  { id: "in4", category: "Taste of India", name: "Butter Chicken (Rice)", price: 30, description: "Chicken in creamy tomato gravy served with rice", isVeg: false, isSpicy: false },
  { id: "in5", category: "Taste of India", name: "Chicken Tikka & Fries (Boneless)", price: 30, description: "Boneless chicken tikka pieces served with fries", isVeg: false, isSpicy: true },
  { id: "in6", category: "Taste of India", name: "Chapatti", price: 2, description: "Fresh Indian flatbread", isVeg: true, isSpicy: false },
  { id: "in7", category: "Taste of India", name: "Paratha", price: 3, description: "Layered Indian flatbread", isVeg: true, isSpicy: false },

  // Arabian Taste
  { id: "ar1", category: "Arabian Taste", name: "Grilled Chicken Rosemary Sauce (Rice)", price: 30, description: "Grilled chicken breast with rosemary sauce and rice", isVeg: false, isSpicy: false },
  { id: "ar2", category: "Arabian Taste", name: "Chicken Wings Provincial & Rice", price: 20, description: "Provincial style chicken wings served with rice", isVeg: false, isSpicy: false },
  { id: "ar3", category: "Arabian Taste", name: "Chicken Shish Taouk", price: 35, description: "Grilled marinated chicken skewers (Fries-Bread)", servedWith: "Fries-Bread", isVeg: false, isSpicy: false },
  { id: "ar4", category: "Arabian Taste", name: "Mixed Grilled", price: 50, description: "Assortment of grilled meats (Fries-Bread)", servedWith: "Fries-Bread", isVeg: false, isSpicy: false },
  { id: "ar5", category: "Arabian Taste", name: "Chicken Mandi", price: 30, description: "Traditional mandi rice with chicken", isVeg: false, isSpicy: false },
  { id: "ar6", category: "Arabian Taste", name: "Grilled Hamour Fillet", price: 45, description: "Grilled fish fillet served with fries", servedWith: "Fries", isVeg: false, isSpicy: false },

  // Italian Taste
  { id: "it1", category: "Italian Taste", name: "Spaghetti with Meat Balls", price: 25, description: "Spaghetti pasta with tomato sauce and meatballs", isVeg: false, isSpicy: false },
  { id: "it2", category: "Italian Taste", name: "Pizza Margarita", price: 20, description: "Classic cheese and tomato pizza", isVeg: true, isSpicy: false },
  { id: "it3", category: "Italian Taste", name: "Pizza Pepperoni", price: 25, description: "Pizza topped with pepperoni slices", isVeg: false, isSpicy: true },
  { id: "it4", category: "Italian Taste", name: "Chicken BBQ Pizza", price: 25, description: "Pizza topped with BBQ chicken", isVeg: false, isSpicy: false },
  { id: "it5", category: "Italian Taste", name: "Pasta Arabiatta", price: 20, description: "Pasta in spicy tomato sauce", isVeg: true, isSpicy: true },
  { id: "it6", category: "Italian Taste", name: "Pasta with Chicken", price: 22, description: "Pasta with chicken", isVeg: false, isSpicy: false },
  { id: "it7", category: "Italian Taste", name: "Pesto Sauce Pasta", price: 22, description: "Pasta tossed in basil pesto sauce", isVeg: true, isSpicy: false },
  { id: "it8", category: "Italian Taste", name: "Alfredo Pasta", price: 22, description: "Pasta in creamy alfredo sauce", isVeg: true, isSpicy: false },

  // DESSERT
  { id: "ds1", category: "DESSERT", name: "Fruit Salad", price: 25, description: "Fresh mixed fruit salad", isVeg: true, isSpicy: false },
  { id: "ds2", category: "DESSERT", name: "Cut Fruits Platter", price: 25, description: "Platter of seasonal cut fruits", isVeg: true, isSpicy: false },

  // HOT BEVERAGE
  { id: "hb1", category: "HOT BEVERAGE", name: "Turkish Coffee", price: 12, description: "Traditional Turkish coffee", isVeg: true, isSpicy: false },
  { id: "hb2", category: "HOT BEVERAGE", name: "Tea", price: 10, description: "Black or Green tea", isVeg: true, isSpicy: false },
  { id: "hb3", category: "HOT BEVERAGE", name: "Americano", price: 10, description: "Black coffee", isVeg: true, isSpicy: false },
  { id: "hb4", category: "HOT BEVERAGE", name: "Cappuccino", price: 10, description: "Coffee with frothy milk", isVeg: true, isSpicy: false },

  // COLD BEVERAGE
  { id: "cb1", category: "COLD BEVERAGE", name: "Fresh Juice", price: 12, description: "Watermelon, Orange, or Pineapple", isVeg: true, isSpicy: false },
  { id: "cb2", category: "COLD BEVERAGE", name: "Soft Drink", price: 5, description: "Assorted carbonated drinks", isVeg: true, isSpicy: false },
  { id: "cb3", category: "COLD BEVERAGE", name: "Water 1.5L", price: 5, description: "Large mineral water bottle", isVeg: true, isSpicy: false },
  { id: "cb4", category: "COLD BEVERAGE", name: "Water 500ml", price: 3, description: "Small mineral water bottle", isVeg: true, isSpicy: false },
];
