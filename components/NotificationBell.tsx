import { useState, useEffect } from "react"
import { Bell, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { pusherClient } from "@/lib/pusher"
import { useAuth } from "@/contexts/AuthContext"

export function NotificationBell({ pharmacyId }: { pharmacyId?: string }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  
  // Review Modal State
  const [reviewOrder, setReviewOrder] = useState<any>(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem(`notifications_${user?.id}`)
    if (saved) {
      const parsed = JSON.parse(saved)
      setNotifications(parsed)
      setUnreadCount(parsed.filter((n: any) => !n.read).length)
    }

    if (!user?.id) return

    const channelName = (user.userType === 'pharmacy' || user.userType === 'admin') && pharmacyId
      ? `admin-${pharmacyId}` 
      : `user-${user.id}`

    const channel = pusherClient.subscribe(channelName)

    const handleNewOrder = (data: any) => {
      const newNotif = {
        id: Date.now(),
        title: "New Order Received! 📦",
        message: `Order for ₹${data.totalPrice} from customer`,
        time: new Date().toLocaleTimeString(),
        read: false,
        type: 'new-order',
        data: data
      }
      addNotification(newNotif)
    }

    const handleStatusUpdate = (data: any) => {
      const isDelivered = data.status === 'delivered'
      const newNotif = {
        id: Date.now(),
        title: isDelivered ? "Order Delivered! ✅" : "Order Update 🚚",
        message: isDelivered ? "Your order has been delivered. Please leave a review!" : `Your order status is now: ${data.status}`,
        time: new Date().toLocaleTimeString(),
        read: false,
        type: 'status-update',
        status: data.status,
        canReview: isDelivered,
        orderId: data.orderId,
        pharmacyId: data.pharmacyId // Need this from pusher event
      }
      addNotification(newNotif)
    }

    if (user.userType === 'pharmacy' || user.userType === 'admin') {
      channel.bind('new-order', handleNewOrder)
    } else {
      channel.bind('order-status-update', handleStatusUpdate)
    }

    return () => {
      pusherClient.unsubscribe(channelName)
    }
  }, [user])

  const addNotification = (notif: any) => {
    setNotifications(prev => {
      const updated = [notif, ...prev].slice(0, 10)
      localStorage.setItem(`notifications_${user?.id}`, JSON.stringify(updated))
      return updated
    })
    setUnreadCount(prev => prev + 1)
  }

  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }))
    setNotifications(updated)
    localStorage.setItem(`notifications_${user?.id}`, JSON.stringify(updated))
    setUnreadCount(0)
  }

  const handleSubmitReview = async () => {
    if (!reviewOrder) return
    setSubmitting(true)
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          pharmacyId: reviewOrder.pharmacyId,
          orderId: reviewOrder.orderId,
          rating,
          comment
        })
      })
      if (res.ok) {
        setReviewOrder(null)
        setRating(5)
        setComment("")
        // Remove the review prompt from notifications
        const updated = notifications.map(n => 
          n.orderId === reviewOrder.orderId ? { ...n, canReview: false } : n
        )
        setNotifications(updated)
        localStorage.setItem(`notifications_${user?.id}`, JSON.stringify(updated))
      }
    } catch (err) {
      console.error("Review submission error:", err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <DropdownMenu onOpenChange={(open) => { if (open) markAllRead() }}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative h-9 w-9">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel className="flex items-center justify-between">
            Notifications
            {unreadCount > 0 && <span className="text-[10px] font-normal text-muted-foreground">New alerts</span>}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
              No new notifications
            </div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.map((notif) => (
                <DropdownMenuItem 
                  key={notif.id} 
                  className={`flex flex-col items-start gap-1 p-3 border-b last:border-0 ${!notif.read ? "bg-primary/5" : ""}`}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className={`font-semibold text-sm ${!notif.read ? "text-primary" : ""}`}>
                      {notif.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{notif.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {notif.message}
                  </p>
                  {notif.canReview && (
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="p-0 h-auto text-primary font-bold mt-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        setReviewOrder(notif)
                      }}
                    >
                      Rate Now ★
                    </Button>
                  )}
                </DropdownMenuItem>
              ))}
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={!!reviewOrder} onOpenChange={(open) => !open && setReviewOrder(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Rate Pharmacy Service</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-8 h-8 cursor-pointer transition-colors ${
                    s <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                  }`}
                  onClick={() => setRating(s)}
                />
              ))}
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Any comments? (Optional)</p>
              <Textarea 
                placeholder="Share your experience..." 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <Button 
              className="w-full" 
              onClick={handleSubmitReview} 
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
