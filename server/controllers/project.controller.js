const projectModel = require("../models/project.model");

const addProject = async (req, res) => {
  const {
    title,
    technologies,
    description,
    githubRepo,
    demoUrl,
    userId,
    tagedUsers,
  } = req.body;

  try {
    if ((!title || !technologies || !description || !githubRepo || !userId)) {
        return res.status(400).json({message:"All Fields Required"})
    }

    
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR : " + error });
  }
};

module.exports = { addProject };
