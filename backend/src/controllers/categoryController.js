import Category from "../models/Category.js";
import slugify from "slugify";

export const createCategory = async (req, res) => {
  try {
    let { name, parentCategory, position, showInMenu, meta_title, meta_desc } =
      req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!parentCategory || parentCategory === "0") {
      parentCategory = null;
    }

    const slug = slugify(name, {
      lower: true,
      strict: true,
      trim: true,
    });

    const category = await Category.create({
      name,
      slug,
      parentCategory,
      meta_title,
      meta_desc,
      showInMenu:
        showInMenu === "1" ||
        showInMenu === 1 ||
        showInMenu === true ||
        showInMenu === "true"
          ? "1"
          : "0",
      position: Number(position) || 0,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate("parentCategory", "name slug")
      .sort({ position: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const {
      id,
      name,
      parentCategory,
      showInMenu,
      position,
      meta_title,
      meta_desc,
    } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Category ID required",
      });
    }

    const updateData = {
      parentCategory:
        !parentCategory || parentCategory === "0" ? null : parentCategory,

      showInMenu:
        showInMenu === "1" ||
        showInMenu === 1 ||
        showInMenu === true ||
        showInMenu === "true"
          ? "1"
          : "0",

      position: Number(position) || 0,

      meta_title: meta_title || "",
      meta_desc: meta_desc || "",
    };

    if (name && name.trim()) {
      updateData.name = name.trim();

      updateData.slug = slugify(name.trim(), {
        lower: true,
        strict: true,
        trim: true,
      });
    }

    console.log("UPDATE DATA:", updateData);

    const updated = await Category.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    console.log("UPDATED CATEGORY:", updated);

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update Category Error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Category ID is required" });
    }

    const deleted = await Category.findByIdAndDelete(id);

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// export const getMenuCategories = async (req, res) => {
//   try {
//     const categories = await Category.find({
//       showInMenu: true,
//     })
//       .populate("parentCategory", "name")
//       .sort({ position: 1 })
//       .select("name slug position parentCategory showInMenu");

//     res.status(200).json({
//       success: true,
//       data: categories,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

export const getMenuCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      showInMenu: "1",
    })
      .populate("parentCategory", "name slug")
      .sort({ position: 1 })
      .select("name slug position parentCategory showInMenu");

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
