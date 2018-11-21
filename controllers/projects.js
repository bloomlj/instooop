const Project = require('../models/Project');
const Card = require('../models/Card');
const Sharp = require('sharp');

/**
 * Log module.
 * @module controllers/projects
 */

/**
 * GET /projects - Projects page.
 * @param  {Object} req - Express Request Object
 * @param  {Object} res - Express Response Object
 * @param  {Function} next - Express Middleware Function
 */
exports.index = (req, res, next) => {
  Project.find((err, projects) => {
    if (err) return next(err);
    console.log(req.user);
    if (projects.length === 0) projects = null;

    res.render('projects', {
      title: 'Projects',
      projects
    });
  });
};


/**
 * GET /projects/create - Projects create page.
 * @param  {Object} req - Express Request Object
 * @param  {Object} res - Express Response Object
 * @param  {Function} next - Express Middleware Function
 */
exports.create = (req, res, next) => {
  Project.find((err, projects) => {
    if (err) return next(err);
    if (projects.length === 0) projects = null;

    res.render('projects_create', {
      title: 'Projects',
      projects
    });
  });
};


/**
 * GET /projects/:id - Project detail page.
 * @param  {Object} req - Express Request Object
 * @param  {Object} res - Express Response Object
 * @param  {Function} next - Express Middleware Function
 */
exports.showProjectUpdate = (req, res, next) => {
  Project.findById(req.params.id, (err, project) => {
    if (err) return next(err);
    try {
      //console.log(doc);
    } catch (e) {
      console.log(e);
    }

    Card.find({ projects: project._id }, (err, cards) => {
      if (err) return next(err);

      res.render('project_update', {
        title: `项目：${project.name}`,
        project,
        cards
      });
    });
  });
};


/**
 * GET /projects/:id - Project detail page.
 * @param  {Object} req - Express Request Object
 * @param  {Object} res - Express Response Object
 * @param  {Function} next - Express Middleware Function
 */
exports.showProject = (req, res, next) => {
  Project.findById(req.params.id, (err, project) => {
    if (err) return next(err);
    try {
      //console.log(doc);
    } catch (e) {
      console.log(e);
    }

    Card.find({ projects: project._id }, (err, cards) => {
      if (err) return next(err);

      res.render('project', {
        title: `项目：${project.name}`,
        project,
        cards
      });
    });
  });
};


/**
 * POST /projects - Create new project.
 * @param  {Object} req - Express Request Object
 * @param  {Object} res - Express Response Object
 * @param  {Function} next - Express Middleware Function
 */
exports.postProject = (req, res, next) => {

  console.log(req);
  console.log(req.file);
  req.assert('uid').notEmpty();
  req.assert('name').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/projects');
  }

  const project = new Project({
    uid: req.body.uid,
    name: req.body.name,
    picture:req.file.filename,
    description: req.body.description,
    materials: req.body.materials,
    tools: req.body.tools,
    setps: req.body.setps,
    tips: req.body.tips
  });

  Sharp(req.file.path)
   .resize(320, 240)
   .toFile(req.file.destination+'320x240'+req.file.filename);

  Project.findOne({ uid: req.body.uid }, (err, existingProject) => {
    if (err) { return next(err); }
    if (existingProject) {
      req.flash('errors', { msg: 'This project already exists' });
      return res.redirect('/projects');
    }

    project.save((err) => {
      if (err) { return next(err); }

      req.flash('success', { msg: 'Project created successfully.' });

      res.redirect('/projects');
    });
  });
};




/**
 * POST /projects/:id - Project detail update.
 * @param  {Object} req - Express Request Object
 * @param  {Object} res - Express Response Object
 * @param  {Function} next - Express Middleware Function
 */
exports.updateProject = (req, res, next) => {
  req.assert('name').notEmpty();
  console.log(req.body);
  Project.findByIdAndUpdate(req.params.id, {
    $set: {
      name: req.body.name,
      description: req.body.description,
      materials: req.body.materials,
      tools: req.body.tools,
      setps: req.body.setps,
      tips: req.body.tips
    }
  }, (err) => {
    if (err) return next(err);

    req.flash('success', { msg: 'Project updated successfully.' });

    res.redirect('/projects/');
  });
};


/**
 * GET /projects/delete/:id - Delete project.
 * @param  {Object} req - Express Request Object
 * @param  {Object} res - Express Response Object
 * @param  {Function} next - Express Middleware Function
 */
exports.deleteProject = (req, res, next) => {
  Project.findOneAndRemove({ _id: req.params.id }, (err) => {
    if (err) { return next(err); }

    req.flash('success', { msg: 'Project deleted successfully.' });

    res.redirect('/projects');
  });
};
