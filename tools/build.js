/**
 * 
 */

const { log, exec, error, inRealPackage } = require('./cli');
const fs = require('fs');
const path = require('path');

// Utility to recursively rename all .js files to .mjs files
function recursiveRename (dir)
{
	fs.readdirSync(dir).forEach( f =>
	{
		const filePath = path.join( dir, f);
		const stats = fs.lstatSync( filePath );

		// Recursive browse and rename if this is a directory
		if ( stats.isDirectory() )
		{
			recursiveRename( filePath );
		}

		// Rename to .mjs if this is a .js file
		else if ( path.extname( f ) == '.js' )
		{
			fs.renameSync( filePath, filePath.replace('.js', '.mjs') );
		}
	});
}

// Compile to es modules as .js files
log(`Compiling Typescript to ES modules ...`);
try
{
	exec(`tsc -p tsconfig.module.json`, {shell: true, stdio: [0, 1, 2]});
}
catch (e)
{
	process.exit(1);
}
log(`Done !`);

// Rename all .js files to .mjs files
recursiveRename('dist/');

// Compile to Common JS modules as .js files
log('');
log(`Compiling Typescript to Common JS modules ...`);
try
{
	exec(`tsc`, {stdio: [0, 1, 2]});
}
catch (e)
{
	process.exit(1);
}
log(`Done !`);
