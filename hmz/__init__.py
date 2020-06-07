import os

from flask import Flask, render_template


def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev'
    )

    if test_config is None:
        app.config.from_pyfile('config.py', silent=True)
    else:
        app.config.from_mapping(test_config)

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    from . import blog
    app.register_blueprint(blog.bp)
    app.add_url_rule('/', endpoint='index')

    @app.route('/about')
    def about():
        return render_template('about.html')

    @app.route('/projects')
    def projects():
        return render_template('projects.html')

    @app.route('/lifegame')
    def lifegame():
        return render_template('lifegame.html')

    @app.route('/shootballoon')
    def shootballoon():
        return render_template('shootballoon.html')

    @app.route('/imgprocess')
    def imgprocess():
        return render_template('imgprocessing.html')

    return app