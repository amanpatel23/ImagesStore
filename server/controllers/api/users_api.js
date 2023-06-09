require("dotenv").config();
const User = require("../../models/user");
const Album = require("../../models/album");
const Image = require("../../models/image");
const jwt = require("jsonwebtoken");

module.exports.signup = async function (request, response) {
  const { name, email, password } = request.body;

  try {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response.status(409).json({ error: "Email Already Exists" });
    }

    // Create a new user
    const newUser = new User({ name, email, password });
    await newUser.save();

    response.status(201).json({ message: "User Created Successfully" });
  } catch (error) {
    response.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.signin = async function (request, response) {
  const { email, password } = request.body;

  const secret_key = process.env.JWT_SECRET_KEY;
  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return response.status(401).json({ error: "Invalid Credentials" });
    }

    // Verify the password
    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return response.status(401).json({ error: "Invalid Credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, secret_key, {
      expiresIn: "24h",
    });

    response.status(200).json({ token, name: user.name });
  } catch (error) {
    response.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.addAlbum = async function (request, response) {
  try {
    const { albumName } = request.body;
    const userId = request.userId;

    const newAlbum = await Album.create({ albumName });

    const user = await User.findById(userId);
    user.albums.push(newAlbum);
    await user.save();

    return response.status(200).json({
      album: { albumName, albumId: newAlbum._id },
    });
  } catch (error) {
    response.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.albums = async function (request, response) {
  try {
    const userId = request.userId;

    const user = await User.findById(userId).populate({
      path: "albums",
      options: {
        sort: { createdAt: -1 },
      },
    });

    const albums = user.albums.map((album) => ({
      albumName: album.albumName,
      albumId: album._id,
    }));

    return response.status(200).json({ albums });
  } catch (error) {
    console.log(error);
  }
};

module.exports.saveImages = async function (request, response) {
  try {
    const { imageData, albumId } = request.body;
    const image = await Image.create(imageData);

    const album = await Album.findById(albumId);
    album.images.push(image);
    await album.save();

    response
      .status(200)
      .json({ image, message: "Images Uploaded Successfully. " });
  } catch (error) {
    response.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.getImages = async function (request, response) {
  try {
    const { albumId } = request.query;
    const album = await Album.findById(albumId).populate({
      path: "images",
      options: {
        sort: { createdAt: -1 },
      },
    });
    const images = await album.images;
    response.status(200).json({ images });
  } catch (error) {
    response.status(500).json({ error: "Internal Server Error." });
  }
};

module.exports.delteImage = async function (request, response) {
  try {
    const { imageId, albumId } = request.query;
    await Image.deleteOne({ _id: imageId });
    const album = await Album.findById(albumId);
    await album.images.pull(imageId);
    await album.save();

    response.status(200).json({ message: "Image Deleted Successfully." });
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Internal Server Error." });
  }
};

module.exports.updateImageName = async function (request, response) {
  try {
    const { editImageId, editImageName } = request.body;

    await Image.findByIdAndUpdate(editImageId, {
      imageName: editImageName,
    }).exec();
    response.status(200).json({ message: "Image Name Updated Successfully." });
  } catch (error) {
    response.status(500).json({ message: "Internal Server Error." });
  }
};
