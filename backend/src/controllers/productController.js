import Product from "../models/Product.js";

// ─────────────────────────────────────────────
// CREATE PRODUCT  →  POST /api/products
// Only farmers can create products
// ─────────────────────────────────────────────
export const createProduct = async (req, res) => {
  try {
    const {
      cropName,
      category,
      type,
      price,
      stock,
      harvestDate,
      organicTreatmentHistory,
    } = req.body;

    // Basic required field check
    if (!cropName || !category || !type || !price || !stock || !harvestDate) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const product = await Product.create({
      farmer: req.user._id,   // comes from protect middleware
      cropName,
      category,
      type,
      price,
      stock,
      harvestDate,
      organicTreatmentHistory: organicTreatmentHistory || "",
    });

    res.status(201).json({
      message: "Product listed successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// GET ALL PRODUCTS (public)  →  GET /api/products
// ─────────────────────────────────────────────
export const getAllProducts = async (req, res) => {
  try {
    const { category, type, search, status } = req.query;

    const filter = {};

    if (category) filter.category = category;
    if (type)     filter.type = type;
    if (status)   filter.status = status;

    // Search by crop name (case-insensitive)
    if (search) {
      filter.cropName = { $regex: search, $options: "i" };
    }

    const products = await Product.find(filter)
      .populate("farmer", "name email")   // attach farmer name + email
      .sort({ createdAt: -1 });           // newest first

    res.status(200).json({
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// GET SINGLE PRODUCT (public)  →  GET /api/products/:id
// ─────────────────────────────────────────────
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "farmer",
      "name email"
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// GET MY PRODUCTS  →  GET /api/products/my
// Returns only the logged-in farmer's products
// ─────────────────────────────────────────────
export const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ farmer: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// UPDATE PRODUCT  →  PUT /api/products/:id
// Only the farmer who owns it can update
// ─────────────────────────────────────────────
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Ownership check — only the farmer who created it OR admin can update
    if (
      product.farmer.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized to update this product" });
    }

    const {
      cropName,
      category,
      type,
      price,
      stock,
      harvestDate,
      organicTreatmentHistory,
      status,
    } = req.body;

    // Update only provided fields
    if (cropName  !== undefined) product.cropName  = cropName;
    if (category  !== undefined) product.category  = category;
    if (type      !== undefined) product.type      = type;
    if (price     !== undefined) product.price     = price;
    if (stock     !== undefined) product.stock     = stock;
    if (harvestDate !== undefined) product.harvestDate = harvestDate;
    if (organicTreatmentHistory !== undefined)
      product.organicTreatmentHistory = organicTreatmentHistory;
    if (status !== undefined) product.status = status;

    const updated = await product.save(); // triggers pre-save (auto status)

    res.status(200).json({
      message: "Product updated successfully",
      product: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// DELETE PRODUCT  →  DELETE /api/products/:id
// Only the owning farmer OR admin can delete
// ─────────────────────────────────────────────
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Ownership check
    if (
      product.farmer.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized to delete this product" });
    }

    await product.deleteOne();

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// ADMIN — GET ALL PRODUCTS  →  GET /api/products/admin/all
// Admin sees every product with full farmer info
// ─────────────────────────────────────────────
// export const adminGetAllProducts = async (req, res) => {
//   try {
//     const products = await Product.find()
//       .populate("farmer", "name email role")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       count: products.length,
//       products,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const adminGetAllProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("farmerId", "name email")
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, products, total: products.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
 
// export const adminUpdateProductStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body; // "approved" | "rejected" | "active"
//     const product = await Product.findByIdAndUpdate(id, { status }, { new: true });
//     if (!product) return res.status(404).json({ success: false, message: "Product not found" });
//     res.json({ success: true, product });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

export const adminUpdateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const product = await Product.findByIdAndUpdate(id, { status }, { new: true });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};