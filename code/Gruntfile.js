'use strict';

module.exports = function(grunt) {
	var indPlugin = ['about','anchor','autoformat','baikelink',
				'blockquote','cleardoc','codemirror','colormenu',
				'datemenu','font','fontfamilymenu','fontsizemenu',
				'highlightcode','hn','image','insertcodemenu',
				'insertparagraph','inserttime','link','map',
				'olmenu','pasteword','search','shortcutmenu',
				'source','spacemenu','specharsmenu','table',
				'ulmenu','uploadremoteimage','video'],len = indPlugin.length;
	var exceptExt = [],indDebugFiles = {},indFiles = {};
	
	for(var i=0;i<len;i++){
		var tmpPlugin = indPlugin[i];
		exceptExt.push('!src/core/plugin/'+tmpPlugin+'.plugin.js');
		exceptExt.push('!src/core/ui/'+tmpPlugin+'/**');
		indDebugFiles['dist/<%= pkg.version %>/plugin/'+tmpPlugin+'.plugin.js'] = ['src/core/ui/'+tmpPlugin+'/*.js','src/core/ui/'+tmpPlugin+'/*.json','src/core/plugin/'+tmpPlugin+'.plugin.js'];
		indFiles['bke/<%= pkg.version %>/plugin/'+tmpPlugin+'.plugin.js'] = ['dist/<%= pkg.version %>/plugin/'+tmpPlugin+'.plugin.js'];
	}
	
  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +'*/\n',
    // Task configuration.
    clean: {
      files: ['dist']
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
		core : {
			src: ['src/core/core.js',
					'src/config.js',
					'src/config-dist.js',
					'src/core/command-config.js',
					'src/core/base/*.js',
					'src/lang/zh-cn/zh-cn.js',
					'src/core/command/execCommand.js',
					'src/core/command/insert.js',
					'src/core/command/paragraph.js',
					'src/core/command/text.js',
					'src/core/event/event.js',
					'src/core/filter/filter.js',
					'src/core/plugin/plugin.js',
					'src/core/ui/ui.js',
					'src/interface/*.js',
					'src/core/filter/*.filter.js',
					'src/skin/default/toolbar.js'
				],
			dest: 'dist/<%= pkg.version %>/<%= pkg.name %>.js'
		},
		extend : {
			src: ['src/core/event/*.event.js','src/core/ui/**/*.js','src/core/ui/**/*.json','src/core/plugin/*.js','!src/core/ui/ui.js','!src/core/plugin/plugin.js'].concat(exceptExt),
			dest: 'dist/<%= pkg.version %>/<%= pkg.name %>.ext.js'
		},
		indExt : {
			files:indDebugFiles
		},
		ie : {
			src: ['src/core/base/ie/*.js'],
			dest: 'dist/<%= pkg.version %>/ie/DOMRange.js'
		},
		//default_skin : {
		//	src: ['src/skin/default/toolbar.json'],
		//	dest: 'dist/<%= pkg.version %>/skin/default/toolbar.json'
		//}
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
        core :{
			src: '<%= concat.core.dest %>',
			dest: 'bke/<%= pkg.version %>/<%= pkg.name %>.js'
		},
		extend : {
			src: '<%= concat.extend.dest %>',
			dest: 'bke/<%= pkg.version %>/<%= pkg.name %>.ext.js'
		},
		min : {
			src: ['<%= concat.core.dest %>','<%= concat.extend.dest %>'],
			dest: 'bke/<%= pkg.version %>/<%= pkg.name %>.js'
		},
		indExt : {
			files:indFiles
		},
		all : {
			src: ['<%= concat.core.dest %>','<%= concat.extend.dest %>','bke/<%= pkg.version %>/plugin/**/*.js'],
			dest: 'bke/<%= pkg.version %>/<%= pkg.name %>.min.js'
		},
		ie : {
			src: '<%= concat.ie.dest %>',
			dest: 'bke/<%= pkg.version %>/ie/DOMRange.js'
		},
		//default_skin : {
		//	src: '<%= concat.default_skin.dest %>',
		//	dest: 'bke/<%= pkg.version %>/skin/default/toolbar.json'
		//}
    },
	copy : {
		libs:{expand:true,cwd:'libs/',src: ['**'],dest: 'dist/<%= pkg.version %>/libs'},
		bke_libs:{expand:true,cwd:'libs/',src: ['**'],dest: 'bke/<%= pkg.version %>/libs'},
		skin:{expand:true,cwd:'src/skin/',src: ['*'],dest: 'dist/<%= pkg.version %>/skin'},
		default_skin:{expand:true,cwd : 'src/skin/default/',src: ['**','!toolbar.js'],dest: 'dist/<%= pkg.version %>/skin/default/'}//,
		//main:{expand:true,cwd:'dist/<%= pkg.version %>/',src: ['**','!**/*.js','!**/*.json'],dest: 'bke/<%= pkg.version %>/'}
	},
    qunit: {
      files: ['test/**/*.html']
    },
    jshint: {
      gruntfile: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: 'Gruntfile.js'
      },
      src: {
        options: {
          jshintrc: 'src/.jshintrc'
        },
        src: ['src/core/core.js','src/config.js','src/core/command-config.js',
					'src/core/base/*.js','skin/default/toolbar.js',
					'src/core/command/execCommand.js','src/core/event/event.js',
					'src/core/filter/filter.js','src/core/plugin/plugin.js','src/core/ui/ui.js','src/core/interface/*.js',
					'src/core/command/*.js','src/core/event/*.js',
					'src/core/filter/*.js','src/core/plugin/icon.plugin.js','src/core/plugin/element.plugin.js']
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/**/*.js']
      },
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      src: {
        files: '<%= jshint.src.src %>',
        tasks: ['jshint:src', 'qunit']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'qunit']
      },
    },
  });

  // These plugins provide necessary tasks.
//  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['concat', 'uglify','copy']);
  grunt.registerTask('check', ['qunit', 'jshint']);
  grunt.registerTask('dist', ['concat', 'uglify','copy']);
  grunt.registerTask('dev', ['concat','copy']);

};
