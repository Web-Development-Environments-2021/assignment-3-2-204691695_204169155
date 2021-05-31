CREATE TABLE [dbo].[Logs](
	game_id [int] NOT NULL,
    log_id int IDENTITY(1,1) NOT NULL,
    game_date [varchar](30) NOT NULL,
	minutes [varchar](30) NOT NULL,
	hour [varchar](30) NOT NULL,
	description [varchar](30) NOT NULL,
    PRIMARY KEY (game_id, log_id),
    FOREIGN KEY(game_id) REFERENCES [dbo].[Games](game_id)
)
