//imports
import { readdirSync, mkdirSync, existsSync } from "fs";
import { rimrafSync } from "rimraf";
import FFMPEGStatic from "ffmpeg-static";
import FFMPEG from "fluent-ffmpeg";

//Check if FFMPEG Is not found on the device
if (!FFMPEGStatic) throw new Error("FFMPEG Not Found");

// Tell fluent-ffmpeg where it can find FFmpeg
FFMPEG.setFfmpegPath(FFMPEGStatic);

//Get the Required Constants
const Input_Path = `${process.cwd()}/Audio/Input`;
const Output_Path = `${process.cwd()}/Audio/Output`;
const Channel_Count = 6;

//Get the Audio Input Files
const Audio_Files = readdirSync(Input_Path);

//Setup the Audio Track Names
const Audio_Track_Name: { [value: number]: string } = {
	0: "All_Audio",
	1: "Discord_And_Alerts_Audio",
	2: "Filtered_Microphone",
	3: "Main_Audio",
	4: "Music_Audio",
	5: "TTS_Audio",
};

//Loop through the Audio Input Files
for (const Audio_File of Audio_Files) {
	//
	//Extract the Audio
	Extract_Audio(Audio_File);
}

function Extract_Audio(Audio_File: string) {
	//
	//Setup the Audio Input File Path
	const Audio_File_Path = `${Input_Path}/${Audio_File}`;

	//Setup the Audio Input File Name
	const Audio_File_Name = Audio_File.replace(/\..*/, "");

	//Setup the Output Directory Path for the Audio File
	const Audio_File_Directory_Path = `${Output_Path}/${Audio_File_Name}`;

	//Check if the Output Directory for the Audio File Already Exists and Remove it
	if (existsSync(Audio_File_Directory_Path)) rimrafSync(Audio_File_Directory_Path);

	//Create the Output Directory for the Audio File
	mkdirSync(Audio_File_Directory_Path);

	//Loop through the Channels
	for (let current_channel = 0; current_channel < Channel_Count; current_channel++) {
		//
		//Setup the Audio Channel Output File Path
		const Channel_Path = `${Audio_File_Directory_Path}/${Audio_Track_Name[current_channel]}`;

		//RUN THE FFMPEG COMMAND
		FFMPEG(Audio_File_Path)
			.addOutputOption("-c", "copy")
			.addOutputOption("-map", `0:a:${current_channel}`)
			.saveToFile(`${Channel_Path}.aac`);
	}
}
