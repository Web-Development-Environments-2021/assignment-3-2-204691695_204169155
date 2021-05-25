CREATE TABLE [dbo].[Logs](
	[game_id] [float] NOT NULL,
    [log_id] INT IDENTITY(1,1) NOT NULL ,
    [game_date] [varchar](300) NOT NULL ,
    [minutes] INT NOT NULL ,
    [description] [varchar](MAX) NOT NULL ,
    PRIMARY KEY(game_id,log_id)
)
