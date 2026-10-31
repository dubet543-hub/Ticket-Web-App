const express = require("express");
const router = express.Router();

const Category = require("../models/Category");
const Attendee = require("../models/Attendee");

// Add category
router.post("/", async (req, res) => {
  try {
    const { categoryName, price, coverPrice } = req.body;

    if (!categoryName || price === undefined || coverPrice === undefined) {
      return res.status(400).json({
        message: "categoryName, price, and coverPrice are required",
      });
    }

    const existingCategory = await Category.findOne({ categoryName });

    if (existingCategory) {
      return res.status(400).json({
        message: "Category already exists",
      });
    }

    const newCategory = new Category({
      categoryName,
      price,
      coverPrice,
    });

    const savedCategory = await newCategory.save();

    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({
      message: "Error creating category",
      error: error.message,
    });
  }
});

// Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching categories",
      error: error.message,
    });
  }
});

// Delete category (blocked while attendees still use it)
router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    const attendeeCount = await Attendee.countDocuments({ category: category._id });

    if (attendeeCount > 0) {
      return res.status(400).json({
        message: `Cannot delete "${category.categoryName}": ${attendeeCount} attendee(s) are using it. Delete or move them first.`,
      });
    }

    await category.deleteOne();

    res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting category",
      error: error.message,
    });
  }
});

module.exports = router;