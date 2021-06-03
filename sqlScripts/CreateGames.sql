CREATE TABLE [dbo].[Games](
	[game_id] [float] PRIMARY KEY NOT NULL,
    [homeTeam_id] [float] NOT NULL ,
    [homeTeam_name] [varchar](30) NOT NULL ,
    [visitorTeam_id] [float] NOT NULL ,
    [visitorTeam_name] [varchar](30) NOT NULL ,
    [game_date] [varchar](30) NOT NULL,
    [game_hour] [varchar](30) NOT NULL,
    [stadium] [varchar](30),
    [score] [varchar](50)
)
