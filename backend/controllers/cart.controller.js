import Product from '../models/product.model.js';

export const getCartProducts = async (req, res) => {
    try {
        // 1. Buscar los productos en la base de datos usando los IDs del carrito
        const products = await Product.find({ _id: { $in: req.user.cartItems } });

        // 2. Mapear los productos para agregarles la cantidad
        const cartItems = products.map((product) => {
            // Buscar el item correspondiente en el carrito del usuario
            const item = req.user.cartItems.find((cartItem) => cartItem.id === product.id);

            // Si el item existe, devolvemos el producto con su cantidad.
            // Si no existe (null/undefined), devolvemos null.
            return item ? { ...product.toJSON(), quantity: item.quantity } : null;
        }).filter(Boolean); // 3. Filtrar para eliminar cualquier 'null' que haya quedado

        res.json(cartItems);

    } catch (error) {
        console.log("Error in getCartProducts controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const addToCart = async (req, res) => {
    try{
        const {productId} = req.body;
        const user = req.user;

        const existingItem = user.cartItems.find(item => item.id === productId);
        if(existingItem){
            existingItem.quantity += 1;
        }
        else{
            user.cartItems.push(productId);
        }

        await user.save();
        res.json(user.cartItems);

    }catch(error){
        console.error("Error addToCart controller:", error.message);
        res.status(500).json({message: "Server Error", error: error.message});
    }
}

export const removeAllFromCart = async (req, res) => {
    try {
		const { productId } = req.body;
		const user = req.user;
		if (!productId) {
			user.cartItems = [];
		} else {
			user.cartItems = user.cartItems.filter((item) => item.id !== productId);
		}
		await user.save();
		res.json(user.cartItems);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
}

export const updateQuantity = async (req, res) => {
    try {
        const { id: productId } = req.params;
        const { quantity } = req.body;
        const user = req.user;
        const existingItem = user.cartItems.find(item => item.id === productId);

        if(existingItem){
            if(quantity === 0){
                user.cartItems = user.cartItems.filter(item => item.id !== productId);
                await user.save();
                return res.json(user.cartItems);
            }

            existingItem.quantity = quantity;
            await user.save();
            res.json(user.cartItems);
        }

        else{
            res.status(404).json({message: "Product not found"});
        }
    }catch (error) {
        console.error("Error in updateQuantity controller:", error.message);
        res.status(500).json({message: "Server error", error: error.message});
    }
}
