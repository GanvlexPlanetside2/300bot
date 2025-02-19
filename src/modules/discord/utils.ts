import discord from 'discord.js'

export const getTextChannel = (
  client: discord.Client,
  id: string,
): discord.TextChannel | null => {
  const channel = client.channels.resolve(id)
  if (channel instanceof discord.TextChannel) {
    return channel
  }
  return null
}

export const getDMChannel = async (
  client: discord.Client,
  id: string,
): Promise<discord.DMChannel | null> => {
  const channel = await client.channels.fetch(id)
  if (channel instanceof discord.DMChannel) {
    return channel
  }
  return null
}

export const getEmoji = (
  channel: discord.Channel,
  emojiName: string,
): discord.GuildEmoji | null => {
  if (!(channel instanceof discord.TextChannel)) return null
  return (
    channel.guild.emojis.cache.find(({ name }) => name === emojiName) || null
  )
}

export const formatWithEmojis = (
  channel: discord.Channel,
  message: string,
): string => {
  // eslint-disable-next-line unicorn/no-unsafe-regex
  const emojiExpressionRegex = /{emoji:([^|]*)(?:\|([^}]*))?}/g

  if (channel instanceof discord.TextChannel) {
    return message.replace(
      emojiExpressionRegex,
      (_match, emojiName, fallbackText) => {
        const emoji = channel.guild.emojis.cache.find(
          ({ name }) => name === emojiName,
        )
        if (emoji) {
          return emoji.toString()
        } else if (typeof fallbackText === 'string') {
          return fallbackText
        } else {
          return ''
        }
      },
    )
  } else {
    return message.replace(
      emojiExpressionRegex,
      (_match, _emojiName, fallbackText) => {
        if (typeof fallbackText === 'string') {
          return fallbackText
        } else {
          return ''
        }
      },
    )
  }
}
