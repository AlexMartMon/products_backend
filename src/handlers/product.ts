import { Request, Response } from "express";
import Product from "../models/Product.model";

export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findAll({
      attributes: {exclude: ['createdAt', 'updatedAt']},
      order: [
        ['id', 'DESC']
      ]
    });
    res.json({data: product});
  } catch (error) {
    console.log(error);
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    const product =  await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({error: 'Product not found'});
    }
    res.json({data: product});
  } catch (error) {
    console.log(error);
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ data: product });
  } catch (error) {
    console.log(error);
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    const product =  await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({error: 'Product not found'});
    }

    await product.update(req.body);
    await product.save();
    res.json({data: product});
  } catch (error) {
    console.log(error);
  }
};


export const updateAvailability = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    const product =  await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({error: 'Product not found'});
    }

    product.availability = !product.dataValues.availability;
    await product.save();
    res.json({data: product});
  } catch (error) {
    console.log(error);
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    const product =  await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({error: 'Product not found'});
    }

    await product.destroy();
    res.json({data: "Deleted product successfully"});

  } catch (error) {
    console.log(error);
  }
} 