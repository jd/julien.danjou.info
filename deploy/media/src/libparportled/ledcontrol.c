/*
 * Copyright 2003 Giorgio bitflesh Luparia.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
 */

/*
 * This is a simple program to try out the possibilities of libparportled.
 * This software is stupid, probably buggy, surely poorly-coded.
 * Try it at your own risk.
 *
 * Compile with
 * gcc -lparportled -lpthread -lreadline
 */

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <readline/readline.h>
#include <readline/history.h>

#include <parportled.h>

char *input_line;
int set_time;

/* a little help */
void
help(void)
{
	fprintf(stdout, "Available commands:\n"
			"  help\t\t- guess\n"
			"MANUAL CONTROL\n"
			"  ledon [n]\t- turns on all leds (default) or led #n\n"
			"  ledoff [n]\t- turns off all leds (default) or led #n\n"
			"  bin mask\t- turns on leds from a mask of 8 binary digits\n"
			"  volume n\t- turns on all led till led #n\n"
			"SETTINGS\n"
			"  settime n\t- sets led's blinking and sliding time to n * 0.1 sec\n"
			"DYNAMIC EFFECTS (command runs n*10 times or 1 time if no n is given)\n"
			"  slide [n]\t- slides leds\n"
			"  blink [n]\t- blinks leds\n"
			"  bislide [n]\t- slides leds on and back\n"
			"  biblink [n]\t- turns on alternatively leds\n"
			"  grow [n]\t- like a slide but it fills previous leds\n"
			"  center [n]\t- turns on leds from sides to center\n"
			"  side [n]\t- turns on leds from center to sides\n"
			"  biside [n]\t- combination of center and side\n"
			"DEMONSTRATION\n"
			"  demo\t- shows a short demonstration of each effect\n"
		);
}

/* turns on all leds or, if a parameter is given, that led */
void
ledon(void)
{
	short led_num = -1;
	if ((input_line[5] == ' ') && (isdigit(input_line[6])))
		led_num = input_line[6] - '0';

	if (led_num == -1)
		led_on_all();
	else if ((led_num >= 1) && (led_num <= 8))
		led_on(led_num);
}

/* turns off all leds or, if a parameter is given, that led */
void
ledoff(void)
{
        short led_num = -1;
        if ((input_line[6] == ' ') && (isdigit(input_line[7])))
                led_num = input_line[7] - '0';

        if (led_num == -1)
                led_off_all();
        else if ((led_num >= 1) && (led_num <= 8))
                led_off(led_num);
}

/* sets blinking and sliding time */
void
settime(void)
{
	short set = -1;
	if ((input_line[7] == ' ') && (isdigit(input_line[8])))
		set = input_line[8] - '0';

	if (set != -1)
		set_time = set * 100000;

	if (set_time == 0)
		set_time = 1000000;

	led_off_all();
}

/* turns on all leds till led given */
void
volume(void)
{
        short i, led_num = -1;
	if ((input_line[6] == ' ') && (isdigit(input_line[7])))
		led_num = input_line[7] - '0';

	if ((led_num >= 1) && (led_num <= 8))
	{
		for (i = 1; i <= led_num; i++)
			led_on(i);
		for (i = led_num + 1; i <= 8; i++)
			led_off(i);
	}
}

/* turns on all leds till led given */
void
bin(void)
{
	unsigned short i, ret = 0;

	if ((input_line[3] != ' '))
		ret = 1;

	for (i = 4; i <= 11; i++)
	{
		if (!((input_line[i] == '0') || (input_line[i] == '1')))
			ret = 1;
	}

	if (ret == 0)
	{
		for (i = 4; i <= 11; i++)
			if (input_line[i] == '1')
				led_on(i - 3);
			else
				led_off(i - 3);
	}
}

/* make a funny led slide */
void
slide(void)
{
	int i, times;
	short h;
	
	if ((input_line[5] == ' ') && (isdigit(input_line[6])))
		times = 10 * (input_line[6] - '0');
	else
		times = 1;

	for (i = 1; i <= times; i++)
	{
		for (h = 1; h <= 9; h++)
		{
			/* ok, redundant... forgive me... */
			if ((h >= 1) && (h <= 8))
				led_on(h);
			if (h != 1)
				led_off(h - 1);
			usleep((int)(set_time / 8));
		}
	}
}

/* blink leds */
void
blink(void)
{
	int i, times;
	short h;
	
	if ((input_line[5] == ' ') && (isdigit(input_line[6])))
		times = 10 * (input_line[6] - '0');
	else
		times = 1;
	
	for (i = 1; i <= times; i++)
	{
		for (h = 1; h <= 8; h++)
			led_on(h);
		usleep((int)(set_time / 2));
		for (h = 1; h <= 8; h++)
			led_off(h);
		usleep((int)(set_time / 2));
	}
}

/* make a double funny led slide */
void
bislide(void)
{
	int i, times;
	short h;

	if ((input_line[7] == ' ') && (isdigit(input_line[8])))
		times = 10 * (input_line[8] - '0');
	else
		times = 1;

	for (i = 1; i <= times; i++)
	{
		for (h = 1; h <= 8; h++)
		{
			/* ok, redundant... forgive me... */
			if ((h >= 1) && (h <= 8))
				led_on(h);
			if (h != 1)
				led_off(h - 1);
			usleep((int)(set_time / 8));
		}
		for (h = 8; h >= 1; h--)
		{
			/* same here */
			if ((h >= 1) && (h <= 8))
				led_on(h);
			if (h != 8)
				led_off(h + 1);
			usleep((int)(set_time / 8));
		}
	}

	led_off(1);
}

/* blink leds */
void
biblink(void)
{
	int i, times;
	short h;

	if ((input_line[7] == ' ') && (isdigit(input_line[8])))
		times = 10 * (input_line[8] - '0');
	else
		times = 1;
	
	for (i = 1; i <= times; i++)
	{
		for (h = 1; h <= 8; h++)
		{
			led_on(h);
			led_off(++h);
		}
		
		usleep((int)(set_time / 2));

		for (h = 1; h <= 8; h++)
		{
			led_off(h);
			led_on(++h);
		}

		usleep((int)(set_time / 2));
	}

	led_off_all();
}

/* like slide, but heavier ;) */
void
grow(void)
{
	int i, times;
	short h;
	
	if ((input_line[4] == ' ') && (isdigit(input_line[5])))
		times = 10 * (input_line[5] - '0');
	else
		times = 1;
	for (i = 1; i <= times; i++)
	{
		for (h = 1; h <= 8; h++)
		{
			led_on(h);
			usleep((int)(set_time / 9));
		}
		led_off_all();
		usleep((int)(set_time / 9));
	}
}

/* leds are lighted from sides to center */
void
center(void)
{
	int i, times;
	short h;

	if ((input_line[6] == ' ') && (isdigit(input_line[7])))
		times = 10 * (input_line[7] - '0');
	else
		times = 1;
	
	for (i = 1; i <= times; i++)
	{
		for (h = 1; h <= 5; h++)
		{
			/* ok, redundant... forgive me... */
			if ((h >= 1) && (h <= 4))
			{
				led_on(h);
				led_on(9 - h);
			}
			if (h != 1)
			{
				led_off(h - 1);
				led_off(10 - h);
			}
			usleep((int)(set_time / 8));
		}
	}
}

/* leds are lighted from center to side */
void
side(void)
{
	int i, times;
	short h;

	if ((input_line[4] == ' ') && (isdigit(input_line[5])))
		times = 10 * (input_line[5] - '0');
	else
		times = 1;

	for (i = 1; i <= times; i++)
	{
		for (h = 5; h <= 9; h++)
		{
			/* ok, redundant... forgive me... */
			if ((h >= 5) && (h <= 8))
			{
				led_on(h);
				led_on(9 - h);
			}
			if (h != 5)
			{
				led_off(h - 1);
				led_off(10 - h);
			}

			usleep((int)(set_time / 8));
		}
	}
}

/* center and side combination */
void
biside(void)
{
	int i, times;
	short h;
	
	if ((input_line[6] == ' ') && (isdigit(input_line[7])))
		times = 10 * (input_line[7] - '0');
	else
		times = 1;
	
	for (i = 1; i <= times; i++)
	{
		for (h = 5; h <= 8; h++)
		{
			/* ok, redundant... forgive me... */
			if ((h >= 5) && (h <= 8))
			{
				led_on(h);
				led_on(9 - h);
			}
			if (h != 5)
			{
				led_off(h - 1);
				led_off(10 - h);
			}
			if (h != 8)
				usleep((int)(set_time / 8));
		}


		for (h = 1; h <= 4; h++)
		{
			/* ok, redundant... forgive me... */
			if ((h >= 1) && (h <= 4))
			{
				led_on(h);
				led_on(9 - h);
			}
			if (h != 1)
			{
				led_off(h - 1);
				led_off(10 - h);
			}
			if (h != 4)
				usleep((int)(set_time / 8));
		}
		
	}

	usleep((int)(set_time / 8));
	led_off_all();
}

/* funny demo! */
void
demo(void)
{
	int set_time_backup;

	set_time_backup = set_time;
	set_time = 1000000;

	input_line = (char *)realloc(input_line, 7 * sizeof(char));
	input_line[6] = '\n';
	input_line[7] = '\0';
	grow();

	input_line = (char *)realloc(input_line, 8 * sizeof(char));
	input_line[5] = ' ';
	input_line[6] = '1';
	input_line[7] = '\0';
	set_time = 200000;
	blink();

	input_line = (char *)realloc(input_line, 10 * sizeof(char));
	input_line[7] = ' ';
	input_line[8] = '1';
	input_line[9] = '\0';
	biblink();

	input_line = (char *)realloc(input_line, 6 * sizeof(char));
	input_line[5] = '\0';
	set_time = 400000;
	slide();
	usleep(200000);
	slide();

	input_line = (char *)realloc(input_line, 10 * sizeof(char));
	input_line[7] = '-';
	input_line[8] = '1';
	input_line[9] = '\0';
	bislide();
	input_line[7] = ' ';
	set_time = 100000;
	bislide();

	input_line = (char *)realloc(input_line, 9 * sizeof(char));
	input_line[6] = ' ';
	input_line[7] = '1';
	input_line[8] = '\0';
	biside();

	usleep(800000);
	led_on_all();
	usleep(800000);
	led_off(6);
	usleep(300000);
	led_off(2);
	usleep(300000);
	led_off(3);
	usleep(200000);
	led_off(8);
	usleep(180000);
	led_off(1);
	usleep(120000);
	led_off(5);
	usleep(100000);
	led_off(7);
	usleep(50000);
	led_off(4);

	set_time = set_time_backup;
}
	
/* main loop */
int
main(void)
{
	input_line = (char *)malloc(6 * sizeof(char));

	led_setperm();

	set_time = 200000;

	while (strncmp(input_line, "quit", 4) != 0)
	{
		input_line = readline("Led Control> ");

		/* I know instruction parsing is really lame :/ */
		if (!strncmp(input_line, "help", 4))
			help();
		if (!strncmp(input_line, "ledon", 5))
			ledon();
		if (!strncmp(input_line, "ledoff", 6))
			ledoff();
		if (!strncmp(input_line, "settime", 7))
			settime();
		if (!strncmp(input_line, "volume", 6))
			volume();
		if (!strncmp(input_line, "bin", 3))
			bin();
		if (!strncmp(input_line, "slide", 5))
			slide();
		if (!strncmp(input_line, "blink", 5))
			blink();
		if (!strncmp(input_line, "bislide", 7))
			bislide();
		if (!strncmp(input_line, "biblink", 7))
			biblink();
		if (!strncmp(input_line, "grow", 4))
			grow();
		if (!strncmp(input_line, "center", 6))
			center();
		if (!strncmp(input_line, "side", 4))
			side();
		if (!strncmp(input_line, "biside", 6))
			biside();
		if (!strncmp(input_line, "demo", 4))
			demo();
	}

	led_off_all();

	exit(0);
}
