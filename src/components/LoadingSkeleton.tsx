import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/i18n';

export default function LoadingSkeleton() {
  const lang = useLanguage();
  return (
    <div className="space-y-4">
      {/* Loading indicator */}
      <div className="text-center pb-6">
        <div className="inline-flex items-center gap-3 text-purple-500 bg-white/50 px-6 py-3 rounded-full shadow-sm backdrop-blur-sm border border-purple-100">
          <div className="relative w-6 h-6">
            <div className="absolute inset-0 border-2 border-purple-200 rounded-full" />
            <div className="absolute inset-0 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <span className="text-sm font-semibold animate-pulse-glow">{t('loading.searching', lang)}</span>
        </div>
      </div>

      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="glass rounded-xl p-5 animate-pulse"
          style={{ animationDelay: `${i * 150}ms` }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-5">
            <div className="flex-1 space-y-4">
              {/* Outbound skeleton */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-14 bg-gray-200 rounded" />
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 w-28">
                    <div className="w-8 h-8 bg-gray-200 rounded" />
                    <div className="space-y-1">
                      <div className="h-3 w-16 bg-gray-200 rounded" />
                      <div className="h-2 w-12 bg-gray-200 rounded" />
                    </div>
                  </div>
                  <div className="flex-1 flex items-center gap-3">
                    <div className="text-right">
                      <div className="h-5 w-12 bg-gray-200 rounded" />
                      <div className="h-3 w-8 bg-gray-200 rounded mt-1" />
                    </div>
                    <div className="flex-1 h-px bg-gray-200" />
                    <div>
                      <div className="h-5 w-12 bg-gray-200 rounded" />
                      <div className="h-3 w-8 bg-gray-200 rounded mt-1" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100" />

              {/* Inbound skeleton */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-14 bg-gray-200 rounded" />
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 w-28">
                    <div className="w-8 h-8 bg-gray-200 rounded" />
                    <div className="space-y-1">
                      <div className="h-3 w-16 bg-gray-200 rounded" />
                      <div className="h-2 w-12 bg-gray-200 rounded" />
                    </div>
                  </div>
                  <div className="flex-1 flex items-center gap-3">
                    <div className="text-right">
                      <div className="h-5 w-12 bg-gray-200 rounded" />
                      <div className="h-3 w-8 bg-gray-200 rounded mt-1" />
                    </div>
                    <div className="flex-1 h-px bg-gray-200" />
                    <div>
                      <div className="h-5 w-12 bg-gray-200 rounded" />
                      <div className="h-3 w-8 bg-gray-200 rounded mt-1" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Price skeleton */}
            <div className="lg:border-l lg:border-gray-100 lg:pl-5 lg:w-44">
              <div className="flex flex-row lg:flex-col items-center lg:items-end gap-2">
                <div className="h-7 w-28 bg-gray-200 rounded" />
                <div className="h-3 w-16 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
