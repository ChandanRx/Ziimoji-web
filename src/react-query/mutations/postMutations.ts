import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function useCreatePost() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newPost: { content: string; mood: string; mood_emoji: string; image_url?: string }) => {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) throw new Error('Not logged in')

      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            user_id: userData.user.id,
            ...newPost,
          },
        ])
        .select()

      if (error) throw new Error(error.message)
      return data[0]
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

export function useToggleLike() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ postId, isLiked }: { postId: string; isLiked: boolean }) => {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) throw new Error('Not logged in')

      if (isLiked) {
        // Remove like
        const { error } = await supabase
          .from('likes')
          .delete()
          .match({ post_id: postId, user_id: userData.user.id })
        if (error) throw new Error(error.message)
      } else {
        // Add like
        const { error } = await supabase
          .from('likes')
          .insert([{ post_id: postId, user_id: userData.user.id }])
        if (error) throw new Error(error.message)
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}
