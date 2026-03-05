'use client'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { InboxNotification, InboxNotificationList, LiveblocksUIConfig } from "@liveblocks/react-ui"
import { useInboxNotifications, useUnreadInboxNotificationsCount } from "@liveblocks/react/suspense"
import Image from "next/image"
import { ReactNode } from "react"
import { Bell } from "lucide-react"

const Notifications = () => {
  const { inboxNotifications } = useInboxNotifications();
  const { count } = useUnreadInboxNotificationsCount();

  const unreadNotifications = inboxNotifications.filter((notification) => !notification.readAt);

  return (
    <Popover>
      <PopoverTrigger className='relative inline-flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'>
        <Bell className="size-4" />
        <span className="sr-only">Notifications</span>
        {count > 0 && (
          <span className='absolute -right-0.5 -top-0.5 z-20 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground'>
            {count > 9 ? '9+' : count}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent align='end' className='shad-popover'>
        <LiveblocksUIConfig
          overrides={{
            INBOX_NOTIFICATION_TEXT_MENTION: (user: ReactNode) => (
              <>{user} mentioned you.</>
            ),
          }}
        >
          <InboxNotificationList>
            {unreadNotifications.length <= 0 && (
              <p className='py-4 text-center text-sm text-muted-foreground'>
                No new notifications
              </p>
            )}

            {unreadNotifications.length > 0 &&
              unreadNotifications.map((notification) => (
                <InboxNotification
                  key={notification.id}
                  inboxNotification={notification}
                  className='bg-card text-foreground'
                  href={`/documents/${notification.roomId}`}
                  showActions={false}
                  kinds={{
                    thread: (props) => (
                      <InboxNotification.Thread
                        {...props}
                        showActions={false}
                        showRoomName={false}
                      />
                    ),
                    textMention: (props) => (
                      <InboxNotification.TextMention
                        {...props}
                        showRoomName={false}
                      />
                    ),
                    $documentAccess: (props) => (
                      <InboxNotification.Custom
                        {...props}
                        title={props.inboxNotification.activities[0].data.title}
                        aside={
                          <InboxNotification.Icon className='bg-transparent'>
                            <Image
                              src={
                                (props.inboxNotification.activities[0].data
                                  .avatar as string) || ''
                              }
                              width={36}
                              height={36}
                              alt='avatar'
                              className='rounded-full'
                            />
                          </InboxNotification.Icon>
                        }
                      >
                        {props.children}
                      </InboxNotification.Custom>
                    ),
                  }}
                />
              ))}
          </InboxNotificationList>
        </LiveblocksUIConfig>
      </PopoverContent>
    </Popover>
  );
}

export default Notifications
