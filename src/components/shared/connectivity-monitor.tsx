import { Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useConnectivityStore } from "@/store/useConnectivity";

export const ConnectivityStatus = () => {
  const { isOnline, isReconnecting, visible } = useConnectivityStore();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={cn(
            "fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-lg flex items-center gap-3 cursor-not-allowed select-none",
            isOnline ? "bg-green-500 text-white" : "bg-red-500 text-white"
          )}
        >
          {isOnline ? (
            <>
              <div className="relative">
                <Wifi className="h-5 w-5" />
                {isReconnecting && (
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-white animate-ping" />
                )}
              </div>
              <span className="font-medium">
                {isReconnecting ? "Reconnecting..." : "Connected"}
              </span>
            </>
          ) : (
            <>
              <WifiOff className="h-5 w-5" />
              <span className="font-medium">You're offline</span>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
